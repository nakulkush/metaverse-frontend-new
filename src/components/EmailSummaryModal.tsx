import { useState } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  onSubmit: (emails: string[]) => Promise<void>;
}

export function EmailSummaryModal({
  isOpen,
  onClose,
  roomName,
  onSubmit,
}: EmailSummaryModalProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async () => {
    // Validate emails
    const validEmails = emails.filter(
      (email) => email.trim() && email.includes("@")
    );

    if (validEmails.length === 0) {
      setError("Please enter at least one valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(validEmails);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmails([""]);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Meeting Summary
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="text-green-500 mb-4" size={64} />
              <p className="text-lg font-medium text-gray-800">
                Summary sent successfully!
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Check your email inbox
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Enter email addresses to receive the meeting summary and
                transcription for room <strong>{roomName}</strong>
              </p>

              <div className="space-y-3 mb-4">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-10 pr-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    {emails.length > 1 && (
                      <button
                        onClick={() => removeEmailField(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addEmailField}
                className="w-full py-2 text-red-500 hover:bg-blue-50 rounded-lg transition mb-4"
              >
                + Add another email
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-black border border-black text-white hover:text-black rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    "Send Summary"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
