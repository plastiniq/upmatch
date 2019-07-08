export default function (profile) {
  return profile ? {
    'Location': profile['dev_country'],
    // dev_adj_score: profile['dev_adj_score'],
    'Hourly Rate': profile['dev_bill_rate'],
    'English': profile['dev_eng_skill'],
    // dev_portfolio_items_count: profile['dev_portfolio_items_count'],
    // dev_portfolio_items_v2_count: profile['dev_portfolio_items_v2_count'],
    // dev_total_hours: profile['dev_total_hours'],
    // dev_tot_feedback: profile['dev_tot_feedback'],
    // dev_is_affiliated: profile['dev_is_affiliated'],
    'Experience': profile['dev_billed_assignments']
  }
  : null
}
