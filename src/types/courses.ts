export interface CourseCreditBreakdown {
  lecture: number;
  tutorial: number;
  practical: number;
  project: number;
  total: number;
}

export interface SyllabusModule {
  moduleNo: number;
  title: string;
  hours: number;
  topics: string[];
}

export interface CourseMaterialItem {
  id: string;
  title: string;
  type: 'pdf' | 'slides' | 'zip' | 'code';
  uploadedDate: string;
  fileSize: string;
  facultyRemark?: string;
}

export interface EnrolledCourseItem {
  courseCode: string;
  courseTitle: string;
  courseType: 'Embedded Theory' | 'Embedded Lab' | 'Theory Only' | 'Lab Only' | 'Project Only';
  slot: string;
  venue: string;
  credits: CourseCreditBreakdown;
  facultyName: string;
  facultySchool: string;
  facultyEmail: string;
  facultyCabin: string;
  classRepresentative?: string;
  syllabus: SyllabusModule[];
  materials: CourseMaterialItem[];
}
