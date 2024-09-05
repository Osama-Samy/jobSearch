import { Job } from '../database/models/job.model.js'
import { Application } from '../database/models/application.model.js'
import { Company } from '../database/models/company.model.js'
import ExcelJS from 'exceljs'

const getApplicationsForJob = async (req, res) => {
    const jobId = req.params.id;

    try {
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' })
        }

        if (job.company.toString() !== req.user.company.toString()) {
            return res.status(403).json({ msg: 'Not authorized to view applications for this job' })
        }

        const applications = await Application.find({ job: jobId }).populate('applicant')

        res.json({ applications })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

const generateApplicationsReport = async (req, res) => {
    const { companyName, date } = req.query

    try {
        const company = await Company.findOne({ companyName })
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' })
        }

        if (company.companyHR.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to view applications for this company' })
        }
        const parsedDate = new Date(date)
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ msg: 'Invalid date format' })
        }
        const applications = await Application.find({
            company: company._id,
            appliedAt: {
                $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(parsedDate.setHours(23, 59, 59, 999))
            }
        }).populate('applicant').populate('job')

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Applications');

        worksheet.columns = [
            { header: 'Applicant Name', key: 'applicantName', width: 30 },
            { header: 'Job Title', key: 'jobTitle', width: 30 },
            { header: 'Resume', key: 'resume', width: 50 },
            { header: 'Cover Letter', key: 'coverLetter', width: 50 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Applied At', key: 'appliedAt', width: 20 }
        ]
        applications.forEach(application => {
            worksheet.addRow({
                applicantName: `${application.applicant.firstName} ${application.applicant.lastName}`,
                jobTitle: application.job.jobTitle,
                resume: application.resume,
                coverLetter: application.coverLetter,
                status: application.status,
                appliedAt: application.appliedAt.toLocaleString()
            })
        })
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=applications_report_${companyName}_${date}.xlsx`
        )

        await workbook.xlsx.write(res)
        res.end();
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
}

export { getApplicationsForJob, generateApplicationsReport }
