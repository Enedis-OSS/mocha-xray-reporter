import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/step.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Resolve the step status according to the test status", () => {
    it("Should end up with PASS if the test is a success", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/success.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("PASS")
    })

    it("Should end up with FAIL if the test has an error", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/fail.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("FAIL")
    })

    it("Should end up with RENONCEMENT if the test is skipped", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/skip.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("RENONCEMENT")
    })

    it("Should end up with TODO for absent tests", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/todo.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("TODO")
        expect(result.tests[0].steps[1].status).toEqual("TODO")
        expect(result.tests[0].steps[3].status).toEqual("TODO")
    })

    it("Should end up with PENDING if the test is success and @MANUAL", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/success-and-manual.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("PENDING")
    })

    it("Should end up with RENONCEMENT if the test is skipped and @MANUAL", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/skip-and-manual.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("RENONCEMENT")
    })

    it("Should end up with FAIL if the test is failed and @MANUAL", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/step-statuses/error-and-manual.ts'], xrayFile)
        expect(result.tests[0].steps[0].status).toEqual("FAIL")
    })
})

