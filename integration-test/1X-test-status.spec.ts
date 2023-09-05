const assert= require('assert');

it('PASS 1 and ticket will be PASS @TICKET-10 @STEP-1', () => {
  assert(true);
});

it('PASS 2 and ticket will be PASS @TICKET-10 @STEP-2', () => {
  assert(true);
});

it('PASS and ticket will be pending @TICKET-11 @STEP-1', () => {
  assert(true);
});

it('PENDING because of @MANUAL and ticket will be PENDING @TICKET-11 @STEP-2 ', () => {
  assert(true);
});

it('PASS and ticket will be RENONCEMENT @TICKET-12 @STEP-1', () => {
  assert(true);
});

it('PENDING because of @MANUAL and ticket will be RENONCEMENT @TICKET-12 @STEP-2 ', () => {
  assert(true);
});

it.skip('RENONCEMENT and ticket will be RENONCEMENT @TICKET-12 @STEP-3 ', () => {
  assert(true);
});

it('PASS and ticket will be TODO @TICKET-13 @STEP-1', () => {
  assert(true);
});

it('PENDING because of @MANUAL and ticket will be TODO @TICKET-13 @STEP-3 ', () => {
  assert(true);
});

it.skip('RENONCEMENT and ticket will be TODO @TICKET-13 @STEP-4 ', () => {
  assert(true);
});

it('PASS and ticket will be FAIL @TICKET-14 @STEP-1', () => {
  assert(true);
});

it('PENDING because of @MANUAL and ticket will be FAIL @TICKET-14 @STEP-3 ', () => {
  assert(true);
});

it.skip('RENONCEMENT and ticket will be FAIL @TICKET-14 @STEP-4 ', () => {
  assert(true);
});

it('FAIL and ticket will be FAIL @TICKET-14 @STEP-5', () => {
  assert(false);
});
