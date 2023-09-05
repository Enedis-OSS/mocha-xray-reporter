const assert= require('assert');

describe('There is first level describe', () => {
    describe('There is a second level describe', () => {
        it('I am the it @TICKET-4 @STEP-1', () => {
            assert(true);
        });
    });
});

