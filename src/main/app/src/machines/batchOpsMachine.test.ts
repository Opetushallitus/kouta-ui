import { AnyActorRef, interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { BatchOpsMachine } from './batchOpsMachine';
import { JULKAISUTILA } from '../constants';

const expectEventualState = async (actor: AnyActorRef, stateMatch: string) => {
  const expectedState = await waitFor(actor, s => s.matches(stateMatch));
  expect(expectedState.matches(stateMatch)).toEqual(true);
  return expectedState;
};

const runMutationMock = jest.fn();

const mockBatchOpsMachine = BatchOpsMachine.withConfig({
  services: {
    runMutation: runMutationMock,
  },
});

test('Should switch to "confirming"-state on START-event with tila and one matching entity', () => {
  const batchOpsActor = interpret(mockBatchOpsMachine).start();

  batchOpsActor.send({
    type: 'START',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  expect(batchOpsActor.getSnapshot().value).toEqual('confirming');
});

test('Should select all entities after entering "confirming"-state', () => {
  const batchOpsActor = interpret(mockBatchOpsMachine).start();

  let selectionRef = batchOpsActor.getSnapshot().context.selectionRef;

  expect(selectionRef?.getSnapshot()?.context.selection).toEqual({});

  batchOpsActor.send({
    type: 'START',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  selectionRef = batchOpsActor.getSnapshot().context.selectionRef;

  expect(selectionRef?.getSnapshot()?.context.selection).toEqual(
    expect.objectContaining({
      '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU },
    })
  );
});

test('Should not switch to "confirming-state" on START when all selected entities have requested "tila"', () => {
  const batchOpsActor = interpret(mockBatchOpsMachine).start();

  batchOpsActor.send({
    type: 'START',
    tila: JULKAISUTILA.JULKAISTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  expect(batchOpsActor.getSnapshot()).toMatchObject({
    value: 'initial',
  });
});

test('Should return back to initial state and reset context on CANCEL', async () => {
  const batchOpsActor = interpret(mockBatchOpsMachine).start();

  batchOpsActor.send({
    type: 'START',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  let stateSnapshot = batchOpsActor.getSnapshot();

  expect(stateSnapshot.value).toEqual('confirming');
  expect(stateSnapshot.context).toEqual(
    expect.objectContaining({
      entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
      result: undefined,
      tila: JULKAISUTILA.TALLENNETTU,
    })
  );

  batchOpsActor.send({
    type: 'CANCEL',
  });

  stateSnapshot = batchOpsActor.getSnapshot();

  expect(stateSnapshot.value).toEqual('initial');
  expect(stateSnapshot.context).toEqual(
    expect.objectContaining({
      entities: {},
      result: undefined,
      tila: undefined,
    })
  );
});

test('Should call runMutation-service, set context.result and return to initial-state on CLOSE', async () => {
  const batchOpsActor = interpret(mockBatchOpsMachine).start();

  runMutationMock.mockResolvedValueOnce([{ oid: '12345', status: 'success' }]);

  batchOpsActor.send({
    type: 'START',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  batchOpsActor.send({
    type: 'EXECUTE',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  expect(batchOpsActor.getSnapshot().value).toEqual('executing');

  expect(runMutationMock).toHaveBeenCalledTimes(1);

  const successState = await expectEventualState(
    batchOpsActor,
    'result.success'
  );

  expect(successState.context).toEqual(
    expect.objectContaining({
      result: [{ oid: '12345', status: 'success' }],
    })
  );

  batchOpsActor.send({
    type: 'CLOSE',
  });

  await expectEventualState(batchOpsActor, 'initial');
});

test('Should enter result.error when runMutation rejects and return to initial on CLOSE', async () => {
  const batchOpsActor = interpret(mockBatchOpsMachine).start();

  runMutationMock.mockRejectedValueOnce({});

  batchOpsActor.send({
    type: 'START',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  batchOpsActor.send({
    type: 'EXECUTE',
    tila: JULKAISUTILA.TALLENNETTU,
    entities: { '12345': { oid: '12345', tila: JULKAISUTILA.JULKAISTU } },
  });

  expect(runMutationMock).toHaveBeenCalledTimes(1);

  await expectEventualState(batchOpsActor, 'result.error');

  batchOpsActor.send({
    type: 'CLOSE',
  });

  await expectEventualState(batchOpsActor, 'initial');
});
