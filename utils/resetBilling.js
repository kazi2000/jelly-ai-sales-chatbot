export const resetBillingIfNeeded = async (store, supabase) => {
  const now = new Date();
  const billingStart = new Date(store.billing_cycle_start);

  const diffDays = (now - billingStart) / (1000 * 60 * 60 * 24);

  if (diffDays >= 30) {
    await supabase
      .from('stores')
      .update({
        messages_used: 0,
        billing_cycle_start: new Date()
      })
      .eq('id', store.id);
  }
};
