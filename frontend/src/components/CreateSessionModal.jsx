import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-6">
          {/* SESSION TITLE */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Session Name</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. React Interview, System Design Round..."
              value={roomConfig.title}
              onChange={(e) => setRoomConfig({ title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && roomConfig.title.trim() && onCreateRoom()}
            />
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.title.trim() && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Session: <span className="font-medium">{roomConfig.title}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.title.trim()}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;