const docs = require('../docs.js')

module.exports = {
  showContent,
  output,
  fromJSON,
  // Models
  models,
  modelsUsers,
  modelsProperty,
  modelsTenantHistory,
  modelsWorkorders,
  // Endpoints
  displayAxios,
  displayEndpoints,
  // Database Structures
  displayDatabase,
  test,
}

function showContent(e) {
  const select = document.getElementById(e)
  select.classList.toggle('show')
  select.classList.toggle('hid')
}

function output(content) {
  document.getElementById('planning').classList.remove('show')
  document.getElementById('planning').classList.add('hid')
  document.getElementById('container').innerHTML = content
}

function fromJSON(obj) {
  return JSON.stringify(obj, undefined, 2)
}

// #region - Models

function models(header, todo, comment, model) {
  // If variable exists, display
  todo = todo ? "<p class='todo'>" + todo + '</p>' : ''
  comment = comment ? "<p class='comment'>" + comment + '</p>' : ''

  // Return Output
  return (
    '<h3>' +
    header +
    '</h3> ' +
    todo +
    comment +
    '<pre>' +
    fromJSON(model) +
    '</pre>'
  )
}

// User Models
function modelsUsers() {
  // Models
  let devModel = docs.models.User.examples[0]
  let landlordModel = docs.models.User.examples[1]
  let tenantModel = docs.models.User.examples[2]

  let header = '<h2>User Models</h2> '
  let outputContent =
    header +
    models('Dev Model', '', '', devModel) +
    models('Landlord User Model', '', '', landlordModel) +
    models('Tenant Model', '', '', tenantModel)

  // Display Output
  output(outputContent)
}

// Property Models
function modelsProperty() {
  // Todo
  let propertyTodo = ''
  // Comments
  let propertyComment = ''

  let header = '<h2>Property Models</h2> '
  let outputContent =
    header +
    models(
      'Property Model 1',
      propertyTodo,
      propertyComment,
      docs.models.Property.examples[0],
    ) +
    models(
      'Property Model 2',
      propertyTodo,
      propertyComment,
      docs.models.Property.examples[1],
    )

  // Display Output
  output(outputContent)
}

// Tenant History Model
function modelsTenantHistory() {
  // Todo
  let tenantHistoryTodo = ''
  // Comments
  let tenantHistoryComment = ''

  let header = '<h2>Tenant History Model</h2> '
  let outputContent =
    header +
    models(
      '',
      tenantHistoryTodo,
      tenantHistoryComment,
      docs.models['Tenant History'].examples[0],
    )
  output(outputContent)
}

// Workorder Model
function modelsWorkorders() {
  // Todo
  let todo = ''
  // Comments
  let comment = ''

  let header = '<h2>Tenant History Model</h2> '
  let outputContent =
    header + models('', todo, comment, docs.models['Work Orders'].examples[0])
  output(outputContent)
}

// #endregion - Models

// #region - End Points
function displayEndpoints(input) {
  let {
    header,
    todo,
    comment,
    endpoint,
    type,
    description,
    expectedInput,
    sampleRequest,
    expectedReturn,
    expectedFailedReturn,
  } = input

  // sample request
  sampleRequest.type = type.toLowerCase()
  sampleRequest.address = docs.address + endpoint
  sampleRequest.input = expectedInput

  // If type == GET, make header a link with the endpoint
  header =
    type == 'GET' ? "<a href='" + endpoint + "'>" + header + '</a>' : header

  // If variable is an object, convert to JSON string
  expectedInput =
    typeof expectedInput == 'object' ? fromJSON(expectedInput) : expectedInput
  expectedReturn =
    typeof expectedReturn == 'object'
      ? fromJSON(expectedReturn)
      : expectedReturn
  expectedFailedReturn =
    typeof expectedFailedReturn == 'object'
      ? fromJSON(expectedFailedReturn)
      : expectedFailedReturn

  // If variable exists, display
  todo = todo ? "<p class='todo'>" + todo + '</p>' : ''
  comment = comment ? "<p class='comment'>" + comment + '</p>' : ''
  endpoint = '<p><strong>Endpoint:</strong> <code>`' + endpoint + '`</code></p>'
  type = '<p><strong>Type:</strong> <code>`' + type + '`</code></p>'
  description =
    '<p><strong>Description:</strong> <code>' + description + '</code></p>'
  expectedInput =
    expectedInput != ''
      ? '<p><strong>Expected Input Sample:</strong> </p> <pre>' +
        expectedInput +
        '</pre>'
      : ''
  sampleRequest =
    sampleRequest != ''
      ? '<p><strong>Sample Request:</strong> </p> <pre>' +
        displayAxios(sampleRequest) +
        '</pre>'
      : ''
  expectedReturn =
    expectedReturn != ''
      ? '<p><strong>Expected Return:</strong> </p> <pre>' +
        expectedReturn +
        '</pre>'
      : ''
  expectedFailedReturn =
    expectedFailedReturn != ''
      ? '<p><strong>Expected Return if Fails:</strong> </p> <pre>' +
        expectedFailedReturn +
        '</pre>'
      : ''

  let outputContent =
    '<h3>' +
    header +
    '</h3>' +
    todo +
    comment +
    endpoint +
    type +
    description +
    expectedInput +
    sampleRequest +
    expectedReturn +
    expectedFailedReturn

  // Output Content
  output(outputContent)
}

function displayAxios(sampleRequest) {
  // if sampleRequest is an object, display
  if (typeof sampleRequest == 'object') {
    let {type, address, input, axiosThen, axiosCatch} = sampleRequest

    // if input is an object, display
    input =
      typeof input == 'object'
        ? ", <div class='indent'>" + fromJSON(input) + '&rpar; <br />'
        : "&rpar; <div class='indent'>"

    return (
      'axios.' +
      type +
      "&lpar;'" +
      address +
      "'" +
      input +
      '.then&lpar;' +
      axiosThen +
      '&rpar;<br />' +
      '.catch&lpar;' +
      axiosCatch +
      '&rpar;</div>'
    )
  } else {
    return sampleRequest
  }
}
// #endregion

// #region - Database Structures
function displayDatabase(input) {
  let {header, todo, comment, table} = input

  //, todo, comment, userDb

  todo = todo ? "<p class='todo'>" + todo + '</p>' : ''
  comment = comment ? "<p class='comment'>" + comment + '</p>' : ''

  let outputContent =
    '<h2> Database Structures </h2> ' +
    '<h3>' +
    header +
    '</h3> ' +
    todo +
    comment +
    '<pre>' +
    fromJSON(table) +
    '</pre>'

  // Output Content
  output(outputContent)
}
// #endregion

function test() {
  output('Something')
}
