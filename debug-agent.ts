
const { DatabaseService } = require('./lib/database');
const { AIAgentService } = require('./lib/ai-agent');

async function test() {
    try {
        console.log("Testing DatabaseService.getInvoices...");
        // We need a dummy user ID or existing one.
        // Let's try to pass a random one, it should return []
        const invoices = await DatabaseService.getInvoices('test-user-id');
        console.log("Invoices:", invoices);

        console.log("Testing AIAgentService.scanForFollowUps...");
        const actions = await AIAgentService.scanForFollowUps('test-user-id');
        console.log("Actions:", actions);

    } catch (e) {
        console.error("Test Failed:", e);
    }
}

test();
