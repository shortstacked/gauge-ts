import { mockProcessExit } from 'jest-mock-process';
import { gauge } from '../../src/gen/messages';
import { StaticLoader } from '../../src/loaders/StaticLoader';
import { MessageProcessorFactory } from '../../src/processors/MessageProcessorFactory';
import { Util } from '../../src/utils/Util';
describe('MessageProcessorFactory', () => {
    let factory = new MessageProcessorFactory(new StaticLoader());
    let _exit = process.exit;

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('.process', () => {
        it('should process kill process request', async () => {
            let mockExit = mockProcessExit();
            let message = new gauge.messages.Message({
                messageId: 0,
                messageType: gauge.messages.Message.MessageType.KillProcessRequest,
                killProcessRequest: new gauge.messages.KillProcessRequest()
            })
            await factory.process(message);

            expect(mockExit).toHaveBeenCalledWith(0);
        })

        it('should load impl before loading files', async () => {
            Util.getListOfFiles = jest.fn().mockReturnValue(['StepImpl.ts']);
            class Foo {
                constructor() {
                }
            }
            Util.importFile = jest.fn().mockResolvedValue({ default: Foo })
            let message = new gauge.messages.Message({
                messageId: 0,
                messageType: gauge.messages.Message.MessageType.ExecutionStarting,
                executionStartingRequest: new gauge.messages.ExecutionStartingRequest()
            })
            await factory.process(message);

        })

        it('should process unsupport message', async () => {
            console.error = jest.fn();
            let mockExit = mockProcessExit();
            let message = new gauge.messages.Message({
                messageId: 0,
                messageType: 343,
            })
            await factory.process(message);
            expect(mockExit).toHaveBeenCalledWith(1);
        })
    })

})
