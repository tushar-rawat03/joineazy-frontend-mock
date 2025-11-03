import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import * as api from "../api/mockApi";
import ProgressBar from "../components/ProgressBar";
import { useAuth } from "../context/AuthContext";

export default function CoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await api.fetchCourseById(id);
        setCourse(res);
        const a = await api.fetchAssignmentsByCourse(id);
        setAssignments(a);
      } catch (err) {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading course...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[2px]"></div>

      {/* content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <header className="p-8 text-white">
          <h1 className="text-3xl font-bold">{course?.title || "Course"}</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Instructor: {course?.professorName || "Unknown"}
          </p>
        </header>

        <main className="flex-1 px-8 pb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-slideFade">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Assignments in this Course
            </h2>

            {assignments.length === 0 ? (
              <p className="text-gray-500 italic">
                No assignments have been added yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {a.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {a.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Deadline:{" "}
                      {new Date(a.deadline).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Type:{" "}
                      <span className="font-medium capitalize">{a.type}</span>
                    </p>

                    {/* analytics section */}
                    {a.type === "group" && (
                      <div className="mt-3 text-xs text-gray-600">
                        Groups Submitted:{" "}
                        {
                          Object.values(a.groups || {}).filter(
                            (g) => g.acknowledged
                          ).length
                        }
                      </div>
                    )}
                    {a.type === "individual" && (
                      <div className="mt-3 text-xs text-gray-600">
                        Students Submitted:{" "}
                        {
                          Object.values(a.submissions || {}).filter(
                            (s) => s.acknowledged
                          ).length
                        }
                      </div>
                    )}

                    <ProgressBar
                      value={
                        a.type === "group"
                          ? Math.round(
                              (Object.values(a.groups || {}).filter(
                                (g) => g.acknowledged
                              ).length /
                                1) *
                                100
                            )
                          : Math.round(
                              (Object.values(a.submissions || {}).filter(
                                (s) => s.acknowledged
                              ).length /
                                (course?.students?.length || 1)) *
                                100
                            )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
