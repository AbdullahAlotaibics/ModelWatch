import { ownerModels as seedModels } from "./ownerModels";

const STORAGE_KEY = "modelwatch-models";

export function getModels() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedModels));
    return seedModels;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedModels));
    return seedModels;
  }
}

export function saveModels(models) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

export function createModel(model) {
  const currentModels = getModels();
  const updatedModels = [model, ...currentModels];
  saveModels(updatedModels);
  return model;
}

export function getModelById(id) {
  return getModels().find((model) => model.id === id);
}