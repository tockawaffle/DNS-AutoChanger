import jobSchema from "../db/schemas/jobSchema";

export async function enableJob(jobName: string, jobStatus: string) {
    const job = await jobSchema.findOne({  });
    console.log(job)
}