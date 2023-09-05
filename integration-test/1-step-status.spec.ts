const assert= require('assert');

it('Success to PASS @TICKET-1 @STEP-1', () => {
  assert(true);
});

it('Failed to FAIL @TICKET-1 @STEP-2', () => {
  assert(false);
});

it.skip('Skipped to RENONCEMENT @TICKET-1 @STEP-3', () => {
  assert(false);
});

//Ticket 1 Step 4 to TODO

it('@MANUAL to PENDING because test is success @TICKET-1 @STEP-5', () => {
  assert(true);
});

it.skip('@MANUAL to RENONCEMENT because test is skipped @TICKET-1 @STEP-6', () => {
  assert(false);
});

it('@MANUAL to FAIL because test is fail @TICKET-1 @STEP-7', () => {
  assert(false);
});
