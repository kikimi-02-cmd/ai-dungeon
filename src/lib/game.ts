import { Scenario, StoryNode, Choice, PlayerStatus, StatusEffect } from '@/lib/types';
import scenariosData from '@/data/scenarios.json';

const scenarios: Scenario[] = scenariosData as Scenario[];

export function getAllScenarios(): Scenario[] {
  return scenarios;
}

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function getNode(scenario: Scenario, nodeId: string): StoryNode | undefined {
  return scenario.nodes.find((n) => n.id === nodeId);
}

export function getStartNode(scenario: Scenario): StoryNode {
  const node = getNode(scenario, scenario.startNodeId);
  if (!node) throw new Error(`Start node not found: ${scenario.startNodeId}`);
  return node;
}

export function initPlayerStatus(name: string): PlayerStatus {
  return { name, hp: 100, maxHp: 100, items: [], flags: [] };
}

export function applyStatusEffect(status: PlayerStatus, effect: StatusEffect): PlayerStatus {
  const next = { ...status, items: [...status.items], flags: [...status.flags] };
  if (effect.hpChange) {
    next.hp = Math.min(next.maxHp, Math.max(0, next.hp + effect.hpChange));
  }
  if (effect.addItem && !next.items.includes(effect.addItem) && next.items.length < 5) {
    next.items.push(effect.addItem);
  }
  if (effect.removeItem) {
    next.items = next.items.filter((i) => i !== effect.removeItem);
  }
  if (effect.addFlag && !next.flags.includes(effect.addFlag)) {
    next.flags.push(effect.addFlag);
  }
  return next;
}

// アイテム・フラグ条件を満たす選択肢のみ返す
export function getAvailableChoices(node: StoryNode, status: PlayerStatus): Choice[] {
  return node.choices.filter((c) => {
    if (c.requiredItem && !status.items.includes(c.requiredItem)) return false;
    if (c.requiredFlag && !status.flags.includes(c.requiredFlag)) return false;
    return true;
  });
}

// 選択肢を選んで次のノードと更新ステータスを返す
export function applyChoice(
  scenario: Scenario,
  choice: Choice,
  status: PlayerStatus
): { nextNode: StoryNode; nextStatus: PlayerStatus } {
  let nextStatus = status;
  if (choice.statusEffect) {
    nextStatus = applyStatusEffect(nextStatus, choice.statusEffect);
  }
  const nextNode = getNode(scenario, choice.nextNodeId);
  if (!nextNode) throw new Error(`Node not found: ${choice.nextNodeId}`);
  if (nextNode.statusEffect) {
    nextStatus = applyStatusEffect(nextStatus, nextNode.statusEffect);
  }
  return { nextNode, nextStatus };
}

export function isGameOver(status: PlayerStatus): boolean {
  return status.hp <= 0;
}
