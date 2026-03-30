import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, LogIn, LogOut, ShieldAlert, Users } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { ContactLead } from "./backend";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

export default function AdminPanel() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminChecking, setAdminChecking] = useState(false);
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const checkAndBootstrapAdmin = useCallback(async () => {
    if (!actor || actorFetching) return;
    setAdminChecking(true);
    try {
      // Try bootstrap first (auto-assigns if no admin exists yet)
      const result = await actor.bootstrapAdmin();
      setIsAdmin(result);
    } catch {
      // Fallback: just check if already admin
      try {
        const result = await actor.isCallerAdmin();
        setIsAdmin(result);
      } catch {
        setIsAdmin(false);
      }
    } finally {
      setAdminChecking(false);
    }
  }, [actor, actorFetching]);

  const fetchLeads = useCallback(async () => {
    if (!actor || actorFetching) return;
    setLeadsLoading(true);
    setLeadsError(null);
    try {
      const result = await actor.getAllLeads();
      setLeads([...result].sort((a, b) => Number(b.timestamp - a.timestamp)));
    } catch {
      setLeadsError("Failed to fetch leads. Make sure you have admin access.");
    } finally {
      setLeadsLoading(false);
    }
  }, [actor, actorFetching]);

  useEffect(() => {
    if (isLoggedIn && actor && !actorFetching) {
      checkAndBootstrapAdmin();
    } else if (!isLoggedIn) {
      setIsAdmin(null);
      setLeads([]);
    }
  }, [isLoggedIn, actor, actorFetching, checkAndBootstrapAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin, fetchLeads]);

  const formatDate = (ts: bigint) =>
    new Date(Number(ts)).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const isLoading = isInitializing || adminChecking || actorFetching;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.118 0.022 204), oklch(0.105 0.02 204) 50%, oklch(0.118 0.022 204))",
      }}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "oklch(0.118 0.022 204 / 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.22 0.028 200 / 0.5)",
        }}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <a
              href="/"
              data-ocid="admin.back.link"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to site
            </a>
            <div
              className="h-5 w-px"
              style={{ background: "oklch(0.22 0.028 200 / 0.5)" }}
            />
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "oklch(0.77 0.12 185 / 0.15)",
                  border: "1px solid oklch(0.77 0.12 185 / 0.3)",
                }}
              >
                <Users size={14} style={{ color: "oklch(0.77 0.12 185)" }} />
              </div>
              <span className="font-semibold text-foreground text-sm">
                Admin Panel
              </span>
            </div>
          </div>

          {isLoggedIn && (
            <Button
              type="button"
              data-ocid="admin.logout.button"
              variant="outline"
              size="sm"
              onClick={clear}
              className="gap-2 bg-transparent text-muted-foreground border-border hover:text-foreground"
            >
              <LogOut size={14} />
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 pt-28 pb-16">
        {/* Loading state */}
        {isLoading && (
          <div
            data-ocid="admin.loading_state"
            className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
          >
            <div
              className="w-12 h-12 rounded-full border-2 animate-spin"
              style={{
                borderColor: "oklch(0.77 0.12 185 / 0.2)",
                borderTopColor: "oklch(0.77 0.12 185)",
              }}
            />
            <p className="text-sm text-muted-foreground">Initializing...</p>
          </div>
        )}

        {/* Login state */}
        {!isLoading && !isLoggedIn && (
          <motion.div
            data-ocid="admin.login.panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.77 0.12 185 / 0.1)",
                border: "1px solid oklch(0.77 0.12 185 / 0.25)",
              }}
            >
              <Users size={36} style={{ color: "oklch(0.77 0.12 185)" }} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Admin Login
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs">
                Sign in with Internet Identity to access the admin panel and
                view submitted leads.
              </p>
            </div>
            <Button
              type="button"
              data-ocid="admin.login.button"
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="btn-cta border-0 font-semibold gap-2 hover:opacity-90"
            >
              {isLoggingIn ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{
                      borderColor: "rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                    }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Access Denied */}
        {!isLoading && isLoggedIn && isAdmin === false && (
          <motion.div
            data-ocid="admin.access_denied.panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.577 0.245 27 / 0.1)",
                border: "1px solid oklch(0.577 0.245 27 / 0.3)",
              }}
            >
              <ShieldAlert size={36} style={{ color: "oklch(0.65 0.2 40)" }} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Admin access has already been assigned to another account.
                Please log in with the correct Internet Identity.
              </p>
            </div>
            <Button
              type="button"
              data-ocid="admin.access_denied.logout.button"
              variant="outline"
              onClick={clear}
              className="gap-2 bg-transparent border-border text-muted-foreground hover:text-foreground"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </motion.div>
        )}

        {/* Admin dashboard */}
        {!isLoading && isLoggedIn && isAdmin === true && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Submitted Leads
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  All contact form submissions from your portfolio site.
                </p>
              </div>
              {!leadsLoading && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "oklch(0.77 0.12 185 / 0.1)",
                    border: "1px solid oklch(0.77 0.12 185 / 0.25)",
                    color: "oklch(0.77 0.12 185)",
                  }}
                >
                  <Users size={12} />
                  {leads.length} lead{leads.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {/* Error state */}
            {leadsError && (
              <div
                data-ocid="admin.leads.error_state"
                className="rounded-xl p-4 text-sm"
                style={{
                  background: "oklch(0.577 0.245 27 / 0.08)",
                  border: "1px solid oklch(0.577 0.245 27 / 0.25)",
                  color: "oklch(0.7 0.18 27)",
                }}
              >
                {leadsError}
              </div>
            )}

            {/* Loading skeleton */}
            {leadsLoading && (
              <div
                data-ocid="admin.leads.loading_state"
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-12 w-full rounded-lg"
                      style={{ background: "oklch(0.18 0.025 204)" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!leadsLoading && !leadsError && leads.length === 0 && (
              <div
                data-ocid="admin.leads.empty_state"
                className="glass-card rounded-2xl p-16 flex flex-col items-center gap-4 text-center"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.77 0.12 185 / 0.08)",
                    border: "1px solid oklch(0.77 0.12 185 / 0.2)",
                  }}
                >
                  <Users
                    size={28}
                    style={{ color: "oklch(0.77 0.12 185 / 0.5)" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">No leads yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Leads will appear here once visitors submit the contact
                    form.
                  </p>
                </div>
              </div>
            )}

            {/* Leads table */}
            {!leadsLoading && !leadsError && leads.length > 0 && (
              <div
                data-ocid="admin.leads.table"
                className="glass-card rounded-2xl overflow-hidden"
              >
                <Table>
                  <TableHeader>
                    <TableRow
                      style={{
                        borderColor: "oklch(0.22 0.028 200 / 0.5)",
                        background: "oklch(0.14 0.022 204)",
                      }}
                    >
                      <TableHead className="text-muted-foreground font-semibold w-12">
                        #
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold">
                        Phone
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold">
                        Message
                      </TableHead>
                      <TableHead className="text-muted-foreground font-semibold whitespace-nowrap">
                        Date &amp; Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead, i) => (
                      <TableRow
                        key={`${lead.phone}-${lead.timestamp}`}
                        data-ocid={`admin.leads.item.${i + 1}`}
                        style={{
                          borderColor: "oklch(0.22 0.028 200 / 0.35)",
                        }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {lead.name}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-sm hover:underline transition-colors"
                            style={{ color: "oklch(0.77 0.12 185)" }}
                          >
                            {lead.phone}
                          </a>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs">
                          <p className="truncate" title={lead.message}>
                            {lead.message}
                          </p>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                          {formatDate(lead.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
