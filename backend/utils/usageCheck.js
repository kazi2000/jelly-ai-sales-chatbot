export const checkUsageLimit = async (store) => {
  if (store.messages_used >= store.plan_limit) {
    return false;
  }
  return true;
};
