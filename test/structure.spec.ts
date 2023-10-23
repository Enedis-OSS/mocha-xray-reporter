import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/structure.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Global structure of the generated json", () => {
    it("Should fill all the test results", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
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

    it("Should fill summary when option is specified", async () => {
        process.env.M2X_JIRA_TEST_EXEC_SUMMARY = "Test results {{version}} of front application"
        process.env.M2X_JIRA_TEST_EXEC_VERSION = "1.2.3"
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.info.summary).toEqual("Test results 1.2.3 of front application")
    })

    it("Should display undefined in the sentence if version not provided, too bad", async () => {
        process.env.M2X_JIRA_TEST_EXEC_SUMMARY = "Test results {{version}} of front application"
        delete process.env.M2X_JIRA_TEST_EXEC_VERSION
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.info.summary).toEqual("Test results undefined of front application")
    })

    it("Should use version and default sentence when there is no summary", async () => {
        delete process.env.M2X_JIRA_TEST_EXEC_SUMMARY
        process.env.M2X_JIRA_TEST_EXEC_VERSION = "1.2.3"
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.info.summary).toEqual("Automatic tests execution for version 1.2.3")
    })

    it("Should use default sentence when there is no summary and no version", async () => {
        delete process.env.M2X_JIRA_TEST_EXEC_SUMMARY
        delete process.env.M2X_JIRA_TEST_EXEC_VERSION
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.info.summary).toEqual("Automatic tests execution")
    })

    it("Should fill test exec ticket when number is provided", async () => {
        process.env.M2X_JIRA_TEST_EXEC_NUMBER = "123"
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.testExecutionKey).toEqual("M2X-123")
    })

    it("Should not fill test exec ticket when number is not provided", async () => {
        delete process.env.M2X_JIRA_TEST_EXEC_NUMBER
        const result = await launchMochaAndReturnResult(['test/resources/structure.ts'], xrayFile)
        expect(result.testExecutionKey).toBeNull()
    })
})

