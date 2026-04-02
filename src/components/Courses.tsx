import { useEffect } from 'react';
import siteData from '../data/siteData.json'
import { courseService } from '../services/courseService';

const { courses } = siteData

export default function Courses() {


  useEffect(() => {

    console.log("Course Call")
 handleGetCourseData()
  
 
  }, [])
  

  const handleGetCourseData = async () => {
  try {
    const res = await courseService.getCourse();

    console.log("Success:", res);
  } catch (err: any) {
    console.log("Error:", err.message);
  }
};



  return (
    <section className="py-20 bg-[#F0EAE1]" id="courses">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span className="text-orange-500 text-xs font-semibold tracking-[0.15em] uppercase">
              {courses.badge}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-3">{courses.title}</h2>
          <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
            {courses.description}
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.items.map((course) => (
            <div
              key={course.number}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl font-bold text-stone-200 leading-none">
                  {course.number}
                </span>
                <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full border border-orange-100">
                  {course.duration}
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 mb-2">{course.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">{course.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-stone-500 text-xs px-2.5 py-1 bg-stone-100 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
