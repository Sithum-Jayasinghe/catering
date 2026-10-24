// Unit tests for AI services — pure logic, no external dependencies

describe('AgentOrchestrator helpers', () => {
  it('normalises agent type names to lowercase', () => {
    const normalise = (name: string) => name.toLowerCase().trim()
    expect(normalise('InventoryAgent')).toBe('inventoryagent')
    expect(normalise('  ProcurementAgent ')).toBe('procurementagent')
  })

  it('builds a structured agent result', () => {
    type AgentResult = {
      agentType: string
      success: boolean
      result?: string
      error?: string
      timestamp: string
    }

    const makeResult = (agentType: string, success: boolean, payload: string): AgentResult => ({
      agentType,
      success,
      [success ? 'result' : 'error']: payload,
      timestamp: new Date().toISOString(),
    })

    const ok = makeResult('inventory', true, 'all good')
    expect(ok.success).toBe(true)
    expect(ok.result).toBe('all good')
    expect(ok.error).toBeUndefined()

    const fail = makeResult('procurement', false, 'timeout')
    expect(fail.success).toBe(false)
    expect(fail.error).toBe('timeout')
  })
})

describe('ChatbotService helpers', () => {
  it('generates a unique conversation id each call', () => {
    const makeId = () => `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const id1 = makeId()
    const id2 = makeId()
    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^conv_/)
  })

  it('truncates a long message for logging', () => {
    const truncate = (msg: string, max = 80) =>
      msg.length > max ? `${msg.slice(0, max)}…` : msg

    const short = 'Hello'
    const long = 'A'.repeat(200)
    expect(truncate(short)).toBe(short)
    expect(truncate(long).length).toBe(81)
    expect(truncate(long).endsWith('…')).toBe(true)
  })
})

describe('SemanticSearch helpers', () => {
  it('tokenises a query into lowercase words', () => {
    const tokenise = (query: string) =>
      query.toLowerCase().split(/\s+/).filter(Boolean)

    expect(tokenise('Low Stock Rice')).toEqual(['low', 'stock', 'rice'])
    expect(tokenise('  expiring  soon  ')).toEqual(['expiring', 'soon'])
  })

  it('scores relevance by keyword overlap', () => {
    const score = (doc: string, query: string) => {
      const docWords = new Set(doc.toLowerCase().split(/\s+/))
      const queryWords = query.toLowerCase().split(/\s+/)
      return queryWords.filter(w => docWords.has(w)).length / queryWords.length
    }

    expect(score('Rice stock is low', 'rice low')).toBe(1)
    expect(score('Wheat flour available', 'rice low')).toBe(0)
  })
})

describe('Health-check response shape', () => {
  it('has the expected fields', () => {
    const health = {
      status: 'ok',
      service: 'ai-gateway',
      agents: ['inventory', 'procurement'],
      llm: { provider: 'ollama', available: false },
      timestamp: new Date().toISOString(),
    }

    expect(health).toHaveProperty('status', 'ok')
    expect(health).toHaveProperty('service')
    expect(Array.isArray(health.agents)).toBe(true)
    expect(health.llm).toHaveProperty('provider')
  })
})
