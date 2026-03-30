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
import {
  ArrowLeft,
  LogIn,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { backendInterface as BackendBase, ContactLead } from "./backend";
import { ExternalBlob } from "./backend";

type AdminActor = BackendBase & {
  uploadSiteImage(key: string, imageData: ExternalBlob): Promise<void>;
  getSiteImage(key: string): Promise<ExternalBlob | null>;
};
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
  const [resetting, setResetting] = useState(false);
  const [imageUploading, setImageUploading] = useState<Record<string, boolean>>(
    {},
  );
  const [imagePreview, setImagePreview] = useState<
    Record<string, string | null>
  >({});
  const [imageSuccess, setImageSuccess] = useState<
    Record<string, string | null>
  >({});
  const [imageError, setImageError] = useState<Record<string, string | null>>(
    {},
  );
  const [selectedFile, setSelectedFile] = useState<Record<string, File | null>>(
    {},
  );

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

  useEffect(() => {
    if (!isAdmin || !actor) return;
    const loadPreviews = async () => {
      try {
        const adminActor = actor as unknown as AdminActor;
        const [heroBlob, logoBlob] = await Promise.all([
          adminActor.getSiteImage("hero"),
          adminActor.getSiteImage("logo"),
        ]);
        setImagePreview((prev) => ({
          ...prev,
          hero: heroBlob ? heroBlob.getDirectURL() : null,
          logo: logoBlob ? logoBlob.getDirectURL() : null,
        }));
      } catch {
        // ignore
      }
    };
    loadPreviews();
  }, [isAdmin, actor]);

  const handleImageUpload = async (key: string) => {
    const file = selectedFile[key];
    if (!file || !actor) return;
    setImageUploading((prev) => ({ ...prev, [key]: true }));
    setImageSuccess((prev) => ({ ...prev, [key]: null }));
    setImageError((prev) => ({ ...prev, [key]: null }));
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes);
      await (actor as unknown as AdminActor).uploadSiteImage(key, blob);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview((prev) => ({ ...prev, [key]: previewUrl }));
      setImageSuccess((prev) => ({
        ...prev,
        [key]: "Image uploaded successfully!",
      }));
      setSelectedFile((prev) => ({ ...prev, [key]: null }));
      setTimeout(
        () => setImageSuccess((prev) => ({ ...prev, [key]: null })),
        3000,
      );
    } catch {
      setImageError((prev) => ({
        ...prev,
        [key]: "Upload failed. Please try again.",
      }));
    } finally {
      setImageUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleResetAdminSystem = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will log you out as admin and allow anyone who logs in next to claim admin access.",
    );
    if (!confirmed || !actor) return;
    setResetting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).resetAdminSystem();
      setIsAdmin(null);
      clear();
    } catch {
      // ignore errors
    } finally {
      setResetting(false);
    }
  };

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
            {/* Website Images Section */}
            <div className="mb-10">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-foreground">
                  Website Images
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload or change images that appear on your website.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(["logo", "hero"] as const).map((key) => (
                  <div
                    key={key}
                    className="glass-card rounded-2xl p-5 flex flex-col gap-4"
                    style={{ border: "1px solid oklch(0.22 0.028 200 / 0.5)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                          background: "oklch(0.77 0.12 185 / 0.15)",
                          border: "1px solid oklch(0.77 0.12 185 / 0.3)",
                          color: "oklch(0.77 0.12 185)",
                        }}
                      >
                        {key === "logo" ? "L" : "H"}
                      </div>
                      <span className="font-semibold text-foreground text-sm capitalize">
                        {key === "logo" ? "Logo" : "Hero Image"}
                      </span>
                    </div>

                    {/* Preview */}
                    <div
                      className="rounded-xl overflow-hidden flex items-center justify-center"
                      style={{
                        background: "oklch(0.14 0.022 204)",
                        border: "1px solid oklch(0.22 0.028 200 / 0.4)",
                        minHeight: key === "hero" ? "120px" : "80px",
                      }}
                    >
                      {imagePreview[key] ? (
                        <img
                          src={imagePreview[key]!}
                          alt={key}
                          className={
                            key === "hero"
                              ? "w-full h-32 object-cover"
                              : "h-16 max-w-full object-contain p-2"
                          }
                        />
                      ) : (
                        <p className="text-xs text-muted-foreground py-6">
                          No image uploaded yet
                        </p>
                      )}
                    </div>

                    {/* File input */}
                    <div className="flex flex-col gap-2">
                      <label
                        className="relative cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          background: "oklch(0.18 0.025 204)",
                          border: "1px solid oklch(0.25 0.028 200 / 0.5)",
                          color: "oklch(0.77 0.12 185)",
                        }}
                        data-ocid={`admin.${key}_image.upload_button`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {selectedFile[key]
                          ? selectedFile[key]!.name
                          : "Choose file..."}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            setSelectedFile((prev) => ({ ...prev, [key]: f }));
                          }}
                        />
                      </label>
                      <Button
                        type="button"
                        data-ocid={`admin.${key}_image.submit_button`}
                        size="sm"
                        disabled={!selectedFile[key] || imageUploading[key]}
                        onClick={() => handleImageUpload(key)}
                        className="btn-cta border-0 font-semibold hover:opacity-90 w-full"
                      >
                        {imageUploading[key] ? (
                          <span className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                              style={{
                                borderColor: "rgba(255,255,255,0.3)",
                                borderTopColor: "#fff",
                              }}
                            />
                            Uploading...
                          </span>
                        ) : (
                          "Upload"
                        )}
                      </Button>
                    </div>

                    {/* Feedback */}
                    {imageSuccess[key] && (
                      <p
                        data-ocid={`admin.${key}_image.success_state`}
                        className="text-xs font-medium"
                        style={{ color: "oklch(0.65 0.15 145)" }}
                      >
                        ✓ {imageSuccess[key]}
                      </p>
                    )}
                    {imageError[key] && (
                      <p
                        data-ocid={`admin.${key}_image.error_state`}
                        className="text-xs font-medium"
                        style={{ color: "oklch(0.65 0.2 10)" }}
                      >
                        ✗ {imageError[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              className="mb-8"
              style={{ borderTop: "1px solid oklch(0.22 0.028 200 / 0.4)" }}
            />

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Submitted Leads
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  All contact form submissions from your portfolio site.
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <Button
                  type="button"
                  data-ocid="admin.reset.button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetAdminSystem}
                  disabled={resetting}
                  className="gap-2 bg-transparent text-rose-400 border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/60 transition-colors"
                >
                  {resetting ? (
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                      style={{
                        borderColor: "oklch(0.65 0.2 10 / 0.3)",
                        borderTopColor: "oklch(0.65 0.2 10)",
                      }}
                    />
                  ) : (
                    <RotateCcw size={13} />
                  )}
                  Reset Admin
                </Button>
              </div>
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
