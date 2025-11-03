import React from "react";
import { Clock, CheckCircle } from "lucide-react";
import { formatDate } from "../utils/date";

export default function AssignmentCard({
  assignment,
  onAcknowledge,
  user,
  groupInfo,
}) {
  const ack =
    assignment.submissions?.[user?.id] ||
    (assignment.groups && groupInfo && assignment.groups[groupInfo.id]);
  const isAcknowledged = ack?.acknowledged;

  return (
    <div className="card relative">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            {assignment.title}
          </h4>
          <p className="text-sm text-gray-600">{assignment.description}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} /> Deadline: {formatDate(assignment.deadline)}
          </div>
        </div>

        {isAcknowledged ? (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">Acknowledged</span>
          </div>
        ) : (
          <button
            onClick={() => onAcknowledge(assignment)}
            className="btn btn-primary text-sm"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
