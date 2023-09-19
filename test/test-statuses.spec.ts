import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/test.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Resolve the test final status according step statuses", () => {
    it("Should end up with PASS if all steps are PASS", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/test-statuses/success.ts'], xrayFile)
        expect(result.tests[0].status).toEqual("PASS")
    })

    it("Should end up with PENDING if a step is PENDING", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/test-statuses/manual.ts'], xrayFile)
        expect(result.tests[0].status).toEqual("PENDING")
    })

    it("Should end up with RENONCEMENT if a step is RENONCEMENT", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/test-statuses/skip.ts'], xrayFile)
        expect(result.tests[0].status).toEqual("RENONCEMENT")
    })

    it("Should end up with TODO if a step is TODO", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/test-statuses/todo.ts'], xrayFile)
        expect(result.tests[0].status).toEqual("TODO")
    })

    it("Should end up with FAIL if a step is FAIL", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/test-statuses/fail.ts'], xrayFile)
        expect(result.tests[0].status).toEqual("FAIL")
    })
})

