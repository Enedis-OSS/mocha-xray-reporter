import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/structure.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Global structure of the generated json", () => {
    it("Should fill everything when there is a version and a test exec from env variables", async () => {
        process.env.M2X_JIRA_TEST_EXEC_NUMBER = "123"
        process.env.M2X_JIRA_TEST_EXEC_VERSION = "1.2.3"
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.info.summary).toEqual("Automatic tests execution for version 1.2.3")
        expect(result.testExecutionKey).toEqual("M2X-123")
        expect(result.tests).toHaveLength(1)
        expect(result.tests[0]).toHaveProperty("start")
        expect(result.tests[0]).toHaveProperty("finish")
        expect(result.tests[0]).toHaveProperty("status")
        expect(result.tests[0].testKey).toEqual("M2X-1")
        expect(result.tests[0].steps).toHaveLength(1)
        expect(result.tests[0].steps[0]).toHaveProperty("status")
        expect(result.tests[0].steps[0]).toHaveProperty("actualResult")
        expect(result.tests[0].steps[0]).toHaveProperty("evidences")
    })

    it("Should not fill summary and testExecutionKey if en variables not set", async () => {
        delete process.env.M2X_JIRA_TEST_EXEC_NUMBER
        delete process.env.M2X_JIRA_TEST_EXEC_VERSION
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.info.summary).toBeNull()
        expect(result.testExecutionKey).toBeNull()
    })
})

