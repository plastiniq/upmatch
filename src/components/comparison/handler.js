const template = {
  'Location':'dev_country',
  'Hourly Rate': 'dev_bill_rate',
  'English': 'dev_eng_skill',
  'Experience': 'dev_billed_assignments'
}

export {
  template
}

export default function (profile) {
  return profile ? Object.assign({}, ...Object.keys(template).map(k => ({[k]: profile[template[k]]})))
  : null
}


