import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // mixin for role-based access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Bootstrap: first caller becomes admin automatically (no token needed).
  // Once an admin is assigned, this function becomes a no-op.
  public shared ({ caller }) func bootstrapAdmin() : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    if (accessControlState.adminAssigned) {
      // Already has an admin — check if caller is the admin
      return AccessControl.isAdmin(accessControlState, caller);
    };
    // No admin yet — make caller the admin
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    return true;
  };

  // Admin-only: reset the entire admin system (clears all roles, allows fresh bootstrap).
  public shared ({ caller }) func resetAdminSystem() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the current admin can reset the system");
    };
    AccessControl.resetState(accessControlState);
  };

  // Contact Lead Type
  type ContactLead = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };

  module ContactLead {
    public func compare(lead1 : ContactLead, lead2 : ContactLead) : Order.Order {
      Int.compare(lead1.timestamp, lead2.timestamp);
    };
  };

  var nextLeadId = 0;
  func getNextLeadId() : Nat {
    nextLeadId += 1;
    nextLeadId;
  };

  let contactLeads = Map.empty<Nat, ContactLead>();

  func guardStoreLead(lead : ContactLead) {
    if (lead.name.size() == 0) { Runtime.trap("Name cannot be empty") };
    if (lead.phone.size() == 0) { Runtime.trap("Phone cannot be empty") };
    if (lead.message.size() == 0) { Runtime.trap("Message cannot be empty") };
    if (lead.message.size() > 10000) { Runtime.trap("Message cannot be longer than 10,000 characters") };
  };

  // Anyone can submit a lead (including guests/anonymous)
  public shared ({ caller }) func storeLead(name : Text, phone : Text, message : Text, timestamp : Int) : async () {
    guardStoreLead({ name; phone; message; timestamp });
    let id = getNextLeadId();
    contactLeads.add(id, { name; phone; message; timestamp });
  };

  // Admin-only: retrieve all leads
  public query ({ caller }) func getAllLeads() : async [ContactLead] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    contactLeads.values().toArray().sort();
  };

  // Admin-only: retrieve leads by phone
  public query ({ caller }) func getLeadsByPhone(phone : Text) : async [ContactLead] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    contactLeads.filter(
      func(_id, lead) {
        lead.phone == phone;
      }
    ).values().toArray().sort();
  };

  // Admin-only: retrieve lead by ID
  public query ({ caller }) func getLeadById(id : Nat) : async ?ContactLead {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    contactLeads.get(id);
  };

  // Admin-only: retrieve leads in time range
  public query ({ caller }) func getLeadsInTimeRange(startTimestamp : Int, endTimestamp : Int) : async [ContactLead] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    contactLeads.filter(
      func(_id, lead) {
        lead.timestamp >= startTimestamp and lead.timestamp <= endTimestamp;
      }
    ).values().toArray().sort();
  };

  // Admin-only: delete a lead
  public shared ({ caller }) func deleteLead(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete leads");
    };
    if (contactLeads.containsKey(id)) {
      contactLeads.remove(id);
    } else {
      Runtime.trap("Lead not found");
    };
  };
};
