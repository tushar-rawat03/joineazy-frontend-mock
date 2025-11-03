import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import * as api from "../api/mockApi";
import { useAuth } from "../context/AuthContext";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    deadline: "",
    type: "individual",
    courseId: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load all professor courses + their assignments
  useEffect(() => {
    async function load() {
      const profCourses = await api.fetchCoursesByProfessor(user.id);
      setCourses(profCourses);

      const courseAssignments = {};
      for (const c of profCourses) {
        const a = await api.fetchAssignmentsByCourse(c.id);
        courseAssignments[c.id] = a;
      }
      setAssignments(courseAssignments);
    }
    load();
  }, [user]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCourse({ title: newCourse, professorId: user.id });
      const res = await api.fetchCoursesByProfessor(user.id);
      setCourses(res);
      setNewCourse("");
      setShowCourseModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createAssignment(assignmentForm);
      const profCourses = await api.fetchCoursesByProfessor(user.id);
      setCourses(profCourses);
      const updatedAssignments = {};
      for (const c of profCourses) {
        const a = await api.fetchAssignmentsByCourse(c.id);
        updatedAssignments[c.id] = a;
      }
      setAssignments(updatedAssignments);
      setShowAssignmentModal(false);
      setAssignmentForm({
        title: "",
        description: "",
        deadline: "",
        type: "individual",
        courseId: "",
        link: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <header className="p-8 text-white">
          <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
          <p className="text-blue-100 text-sm mt-1">
            Manage your courses and track student submissions.
          </p>
        </header>

        <main className="flex-1 px-8 pb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-slideFade">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Courses
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCourseModal(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
                >
                  + New Course
                </button>
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm"
                >
                  + New Assignment
                </button>
              </div>
            </div>

            {courses.length === 0 ? (
              <p className="text-gray-500 italic">
                No courses created yet. Click “+ New Course” to get started.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                  >
                    <h3 className="font-semibold text-lg text-gray-700 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Students: {course.students.length}
                    </p>

                    {/* Assignments */}
                    {(assignments[course.id] || []).map((a) => {
                      const total = course.students.length;
                      const submitted = Object.keys(a.submissions || {}).length;
                      const percent = Math.round((submitted / total) * 100);

                      return (
                        <div
                          key={a.id}
                          className="border p-2 rounded-md bg-gray-50 mb-2"
                        >
                          <p className="font-medium text-gray-800 mb-1">
                            {a.title}
                          </p>

                          {/* 📎 OneDrive Link */}
                          {a.link && (
                            <a
                              href={a.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 text-sm underline block mb-1"
                            >
                              📎 View OneDrive Resource
                            </a>
                          )}

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-1">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">
                            Students Submitted:{" "}
                            <span className="font-semibold text-indigo-700">
                              {submitted}/{total}
                            </span>{" "}
                            ({percent}%)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-slideFade">
            <h3 className="text-lg font-semibold mb-3">Create New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Course title"
                className="w-full border p-2 rounded-lg"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-slideFade">
            <h3 className="text-lg font-semibold mb-3">Create Assignment</h3>
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                  placeholder="Assignment title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  OneDrive Link (optional)
                </label>
                <input
                  type="url"
                  value={assignmentForm.link}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      link: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                  placeholder="Paste OneDrive link here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Course
                </label>
                <select
                  value={assignmentForm.courseId}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      courseId: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                  required
                >
                  <option value="">Choose course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={assignmentForm.deadline}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      deadline: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Submission Type
                </label>
                <select
                  value={assignmentForm.type}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      type: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
