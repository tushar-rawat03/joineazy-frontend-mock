import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="card group relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-bl-lg">
        Course ID: {course.id}
      </div>
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <BookOpen className="text-blue-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-500">
            Enrolled: {course.students?.length || 0} students
          </p>
        </div>
        <Link
          to={`/course/${course.id}`}
          className="btn btn-primary text-sm px-3 py-1"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
