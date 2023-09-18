import fs from "fs"
import Mocha from 'mocha'

const mochaOptions = {
    jiraProjectId: 'M2X',
    ticketPrefix: '@TICKET-',
    stepPrefix: '@STEP-',
    screenshotDir: 'screenshots',
    manualId: '@MANUAL'
}

export const launchMochaAndReturnResult = async (testFiles : Array<String>, xrayFile: string) => {
    const mocha = new Mocha
    testFiles.forEach(testFile => {
        mocha.addFile(testFile)
    })
    const promise = new Promise((resolve) => {
        mocha.reporter('dist/reporter.js', {...mochaOptions, reportPath: xrayFile}).run(() => {
            resolve(true)
        })
    })
    await promise
    return JSON.parse(fs.readFileSync(xrayFile, 'utf-8'))
}
