import { z } from "zod";
import projectsRaw from "./projects.json";
import servicesRaw from "./services.json";
import testimonialsRaw from "./testimonials.json";
import clientsRaw from "./clients.json";
import { projectSchema, serviceSchema, testimonialSchema, clientSchema } from "./schema";

/**
 * Single validated entry point for every content/*.json dataset -- import
 * from here, not the raw JSON files, so every consumer gets the same
 * build-time guarantee that the data actually matches its schema.
 */
export const projects = z.array(projectSchema).parse(projectsRaw);
export const services = z.array(serviceSchema).parse(servicesRaw);
export const testimonials = z.array(testimonialSchema).parse(testimonialsRaw);
export const clients = z.array(clientSchema).parse(clientsRaw);
