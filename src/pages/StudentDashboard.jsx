import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import * as api from "../api/mockApi";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);

  const loadAssignments = async () => {
    const courses = await api.fetchCoursesByStudent(user.id);
    const allAssignments = [];
    for (const c of courses) {
      const courseAssignments = await api.fetchAssignmentsByCourse(c.id);
      allAssignments.push(
        ...courseAssignments.map((a) => ({ ...a, courseTitle: c.title }))
      );
    }
    setAssignments(allAssignments);
  };

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const handleAcknowledge = async (a, groupId, isLeader = false) => {
    await api.acknowledgeAssignment({
      assignmentId: a.id,
      userId: user.id,
      timestamp: new Date().toISOString(),
      isLeader,
      groupId,
    });
    await loadAssignments(); // ✅ reload latest
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome, {user.name} 👋
        </h1>
        {assignments.map((a) => {
          const group = Object.values(a.groups || {}).find((g) =>
            g.members.includes(user.id)
          );
          const groupId = group
            ? Object.keys(a.groups).find((key) => a.groups[key] === group)
            : null;
          const acknowledged = a.submissions?.[user.id]?.acknowledged;
          const isLeader = group?.leaderId === user.id;

          return (
            <div
              key={a.id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-100 mb-4"
            >
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-gray-700 text-sm mb-2">{a.description}</p>
              <p className="text-sm text-gray-700">
                <b>Deadline:</b> {new Date(a.deadline).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                <b>Type:</b>{" "}
                {a.type === "group" ? "Group Assignment" : "Individual"}
              </p>

              {/* INDIVIDUAL */}
              {a.type === "individual" && (
                <>
                  {acknowledged ? (
                    <p className="text-green-600 font-medium">
                      ✅ Acknowledged
                    </p>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(a, null, false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Acknowledge Submission
                    </button>
                  )}
                </>
              )}

              {/* GROUP */}
              {a.type === "group" && (
                <>
                  {group ? (
                    group.acknowledged ? (
                      <p className="text-green-600 font-medium">
                        ✅ Acknowledged (by Leader)
                      </p>
                    ) : isLeader ? (
                      <button
                        onClick={() => handleAcknowledge(a, groupId, true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                      >
                        Acknowledge as Leader
                      </button>
                    ) : (
                      <p className="text-yellow-600">
                        Waiting for Group Leader...
                      </p>
                    )
                  ) : (
                    <p className="text-red-500">
                      ⚠️ You are not part of any group. Form or join one to
                      submit.
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
