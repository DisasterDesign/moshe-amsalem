import type { Project } from "./types";

/**
 * Urban-renewal projects. Every field here is client data - nothing is
 * invented. Replace the placeholders with the real project names, cities and
 * unit counts as soon as they arrive, and delete `pendingProjects` once done.
 */
export const projects: Project[] = [
  {
    name: "[שם הפרויקט - לקבל ממשה]",
    city: "[עיר - לקבל ממשה]",
    type: "פינוי-בינוי",
    units: "[מספר יחידות - לקבל ממשה]",
    status: "[סטטוס - לקבל ממשה]",
    note: "[תיאור קצר של הפרויקט ותפקיד המשרד - לקבל ממשה]",
  },
  {
    name: "[שם הפרויקט - לקבל ממשה]",
    city: "[עיר - לקבל ממשה]",
    type: "תמ״א 38",
    units: "[מספר יחידות - לקבל ממשה]",
    status: "[סטטוס - לקבל ממשה]",
    note: "[תיאור קצר של הפרויקט ותפקיד המשרד - לקבל ממשה]",
  },
  {
    name: "[שם הפרויקט - לקבל ממשה]",
    city: "[עיר - לקבל ממשה]",
    type: "התחדשות עירונית",
    units: "[מספר יחידות - לקבל ממשה]",
    status: "[סטטוס - לקבל ממשה]",
    note: "[תיאור קצר של הפרויקט ותפקיד המשרד - לקבל ממשה]",
  },
];

/** True while the project cards are still placeholders. */
export const projectsArePending = projects.every((p) => p.name.startsWith("["));
