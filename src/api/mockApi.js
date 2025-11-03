function load(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export async function fetchCoursesByProfessor(professorId) {
  const courses = load("courses");
  return courses.filter((c) => c.professorId === professorId);
}
export async function fetchCoursesByStudent(studentId) {
  return load("courses");
}
export async function fetchCourseById(id) {
  const courses = load("courses");
  const course = courses.find((c) => c.id === id);
  if (!course) throw new Error("Course not found");
  return course;
}
export async function createCourse({ title, professorId }) {
  const courses = load("courses");
  const newCourse = {
    id: generateId("course"),
    title,
    professorId,
    professorName: "Dr. Rawat",
    students: ["stu_1", "stu_2", "stu_3", "stu_4", "stu_5"],
  };
  courses.push(newCourse);
  save("courses", courses);
  return newCourse;
}
export async function fetchAssignmentsByCourse(courseId) {
  const assignments = load("assignments");
  return assignments.filter((a) => a.courseId === courseId);
}
export async function createAssignment({
  title,
  description,
  deadline,
  type,
  courseId,
  link,
}) {
  const assignments = load("assignments");
  const newAssignment = {
    id: generateId("assign"),
    title,
    description,
    deadline,
    type,
    courseId,
    link: link || "",
    submissions: {},
    groups:
      type === "group"
        ? {
            group_1: {
              leaderId: "stu_1", // Ritik is the only group leader
              members: ["stu_1", "stu_2", "stu_3", "stu_4", "stu_5"], // all 5 students
              acknowledged: false,
            },
          }
        : {},
  };

  assignments.push(newAssignment);
  save("assignments", assignments);
  return newAssignment;
}

export async function acknowledgeAssignment({
  assignmentId,
  userId,
  timestamp,
  isLeader,
  groupId,
}) {
  const assignments = load("assignments");
  const idx = assignments.findIndex((a) => a.id === assignmentId);
  if (idx === -1) throw new Error("Assignment not found");
  const assignment = assignments[idx];

  if (assignment.type === "individual") {
    assignment.submissions[userId] = { acknowledged: true, timestamp };
  } else if (assignment.type === "group") {
    if (!groupId || !assignment.groups[groupId]) {
      throw new Error("Group not found");
    }
    const group = assignment.groups[groupId];
    if (isLeader && group.leaderId === userId) {
      group.acknowledged = true;
      group.timestamp = timestamp;
      // ✅ mark all group members acknowledged
      group.members.forEach((m) => {
        assignment.submissions[m] = {
          acknowledged: true,
          byLeader: true,
          timestamp,
        };
      });
      assignment.groups[groupId] = group;
    } else if (!isLeader) {
      throw new Error("Only group leader can acknowledge");
    }
  }

  assignments[idx] = assignment;
  save("assignments", assignments);
  return assignment;
}
const defaultUsers = [
  {
    id: "prof_1",
    name: "Dr. Rawat",
    email: "prof@example.com",
    password: "1234",
    role: "professor",
  },
  {
    id: "stu_1",
    name: "Ritik Rawat",
    email: "ritik@student.com",
    password: "1234",
    role: "student",
  },
  {
    id: "stu_2",
    name: "Aarav Mehta",
    email: "aarav@student.com",
    password: "1234",
    role: "student",
  },
  {
    id: "stu_3",
    name: "Priya Sharma",
    email: "priya@student.com",
    password: "1234",
    role: "student",
  },
  {
    id: "stu_4",
    name: "Kabir Singh",
    email: "kabir@student.com",
    password: "1234",
    role: "student",
  },
  {
    id: "stu_5",
    name: "Sneha Patel",
    email: "sneha@student.com",
    password: "1234",
    role: "student",
  },
];
function ensureUsersSeeded() {
  const stored = JSON.parse(localStorage.getItem("users") || "[]");
  if (stored.length === 0) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return stored;
}
export async function login(email, password) {
  const users = ensureUsersSeeded();
  const found = users.find(
    (u) =>
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );
  if (!found) throw new Error("⚠️ Invalid credentials");
  localStorage.setItem("currentUser", JSON.stringify(found));
  return found;
}
export async function logout() {
  localStorage.removeItem("currentUser");
  return true;
}
export async function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}
export async function register({ name, email, password, role = "student" }) {
  const users = ensureUsersSeeded();
  if (users.find((u) => u.email === email))
    throw new Error("Email already exists");
  const newUser = { id: generateId(role), name, email, password, role };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return newUser;
}
export function seedDemoData() {
  if (!localStorage.getItem("courses")) {
    save("courses", [
      {
        id: "course_demo_1",
        title: "Web Development Fundamentals",
        professorId: "prof_1",
        professorName: "Dr. Rawat",
        students: ["stu_1", "stu_2", "stu_3", "stu_4", "stu_5"],
      },
    ]);
  }
  if (!localStorage.getItem("assignments")) {
    save("assignments", [
      {
        id: "assign_demo_1",
        title: "Build a Landing Page",
        description: "Create a responsive webpage using HTML, CSS, and JS.",
        deadline: new Date(Date.now() + 86400000).toISOString(),
        type: "individual",
        courseId: "course_demo_1",
        submissions: {},
        groups: {},
      },
    ]);
  }
  ensureUsersSeeded();
}
