import * as Yup from "yup";

// export const meetingSchema = Yup.object().shape({
//   title: Yup.string()
//     .required("Title is required")
//     .min(3, "Title must be at least 3 characters")
//     .max(100, "Title must not exceed 100 characters"),
//   description: Yup.string()
//     .required("Description is required")
//     .min(10, "Description must be at least 10 characters")
//     .max(500, "Description must not exceed 500 characters"),
//   startTime: Yup.date()
//     .required("Start time is required")
//     .min(new Date(), "Start time must be in the future"),
//   endTime: Yup.date()
//     .required("End time is required")
//     .min(Yup.ref("startTime"), "End time must be after start time"),
//   participants: Yup.array()
//     .of(Yup.string())
//     .required("At least one participant is required")
//     .min(1, "At least one participant is required"),
//   status: Yup.string()
//     .required("Status is required")
//     .oneOf(["scheduled", "in_progress", "completed"], "Invalid status"),
// });
