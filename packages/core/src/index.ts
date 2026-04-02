export interface Agent {
  id: string;
  name: string;
  description?: string;
}

export class AgentBuilder {
  private agent: Partial<Agent> = {};

  setName(name: string): this {
    this.agent.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.agent.description = description;
    return this;
  }

  build(): Agent {
    if (!this.agent.name) {
      throw new Error("Agent name is required");
    }
    return {
      id: crypto.randomUUID(),
      name: this.agent.name,
      ...this.agent,
    };
  }
}

export const initCore = () => {
  console.log("Core initialized.");
};
