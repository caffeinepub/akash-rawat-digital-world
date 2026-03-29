import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  let admin : Principal = Principal.fromText("2vxsx-fae");

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  module ContactSubmission {
    public func compare(submission1 : ContactSubmission, submission2 : ContactSubmission) : Order.Order {
      Text.compare(submission1.name, submission2.name);
    };
  };

  let contactSubmissions = Map.empty<Nat, ContactSubmission>();
  var nextSubmissionId = 0;

  func getNextSubmissionId() : Nat {
    nextSubmissionId += 1;
    nextSubmissionId;
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let submission : ContactSubmission = {
      name;
      email;
      message;
    };
    let id = getNextSubmissionId();
    contactSubmissions.add(id, submission);
  };

  public shared ({ caller }) func getAllContactSubmissions() : async [ContactSubmission] {
    if (caller != admin) { Runtime.trap("Unauthorized") };
    contactSubmissions.values().toArray().sort();
  };
};
