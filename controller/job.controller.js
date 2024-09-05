import { Job } from '../database/models/job.model.js'
import { Application } from '../database/models/application.model.js'
import { Company } from '../database/models/company.model.js'

const addJob = async (req, res) => {
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        company
    } = req.body

    try {
        const job = new Job({
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            addedBy: req.user._id,
            company
        })

        await job.save()

        res.status(201).json({ msg: 'Job added successfully', job })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const updateJob = async (req, res) => {
    const jobId = req.params.id
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills
    } = req.body

    try {
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' })
        }
        if (job.addedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to update this job' })
        }
        if (jobTitle) job.jobTitle = jobTitle
        if (jobLocation) job.jobLocation = jobLocation
        if (workingTime) job.workingTime = workingTime
        if (seniorityLevel) job.seniorityLevel = seniorityLevel
        if (jobDescription) job.jobDescription = jobDescription
        if (technicalSkills) job.technicalSkills = technicalSkills
        if (softSkills) job.softSkills = softSkills

        await job.save()

        res.json({ msg: 'Job updated successfully', job })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const deleteJob = async (req, res) => {
    const jobId = req.params.id

    try {
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' })
        }
        if (job.addedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to delete this job' })
        }

        await Job.findByIdAndDelete(jobId)

        res.json({ msg: 'Job deleted successfully' })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
}

const getAllJobsWithCompanyInfo = async (req, res) => {
    try {
        const jobs = await Job.find().populate('company')
        res.json({ jobs })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const getJobsForCompany = async (req, res) => {
    const { companyName } = req.query

    try {
        const company = await Company.findOne({ companyName })
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' })
        }

        const jobs = await Job.find({ company: company._id }).populate('company')
        res.json({ jobs })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const getJobsWithFilters = async (req, res) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query

    const filters = {}
    if (workingTime) filters.workingTime = workingTime
    if (jobLocation) filters.jobLocation = jobLocation
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel
    if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: 'i' }
    if (technicalSkills) filters.technicalSkills = { $all: technicalSkills.split(',') }
    try {
        const jobs = await Job.find(filters).populate('company')
        res.json({ jobs })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const applyToJob = async (req, res) => {
    const { jobId, resume, coverLetter } = req.body

    try {
        const application = new Application({
            job: jobId,
            applicant: req.user._id,
            resume,
            coverLetter
        })
        await application.save();

        res.status(201).json({ msg: 'Applied to job successfully', application })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

export { 
    addJob,
    updateJob,
    deleteJob,
    getAllJobsWithCompanyInfo,
    getJobsForCompany,
    getJobsWithFilters,
    applyToJob
}