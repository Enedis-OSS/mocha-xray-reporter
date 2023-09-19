import { cleanTestArtifacts, launchMochaAndReturnResult } from './resources/util';
import fs from "fs"

const xrayFile = "xray-results/different-files.json"
beforeEach(() => {
    cleanTestArtifacts(xrayFile)
})

describe("Should handle tests in different files @TICKET and @STEP", () => {
    it("Should handle steps of same ticket in separate files", async () => {
        const result = await launchMochaAndReturnResult(['test/resources/different-files-2.ts', 'test/resources/different-files-1.ts'], xrayFile)
        expect(result.tests[0].steps).toHaveLength(2)
    })
})

