/* 
TODO: Still refactoring some things so they can be edited in this document.
  This will be the primary file to update the documents index page.
*/
// const {users} = require('../../database/seedData.js')
const seedData = require('../../database/seedData.js')

// #region - User variables

// Users
// const usersModels = []
// users.forEach((x, i) => {
//   usersModels.push({id: i + 1, ...x})
// })

// const landlordModel = {
//   userId: 1,
//   email: 'landlord@email.com',
//   firstName: 'Firstname',
//   lastName: 'Lastname',
//   type: 'landlord',
//   phone: '123-456-7890',
// }
// const devModel = {
//   userId: 2,
//   email: 'dev@email.com',
//   type: 'dev',
// }
// const tenantModel = {
//   userId: 3,
//   email: 'tenant@email.com',
//   type: 'tenant',
// }
const users = []
seedData.users.forEach((x, i) => {
  users.push({id: i + 1, ...x})
})

const registerInput = {
  email: 'example@gmail.com',
  password: 'badpassword',
  type: 'landlord',
}
const registerReturn = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
}
const LoginInput = {
  email: 'example@gmail.com',
  password: 'badpassword',
}
const LoginReturn = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
}

//#endregion

// #region - Properties variables

const properties = []
seedData.properties.forEach((x, i) => {
  properties.push({id: i + 1, ...x})
})

const addPropertyInput = {
  name: 'Property Name',
  street: '1 First St',
  city: 'Salt Lake City',
  state: 'Utah',
  zip: '84101',
  status: 'occupied',
  landlordId: 1,
}
const addPropertyReturn = {
  id: 3,
  name: 'Property Name',
  street: '1 First St',
  city: 'Salt Lake City',
  state: 'Utah',
  zip: '84101',
  status: 'occupied',
  image: null,
  landlordId: 1,
}
const updatePropertyInput = {
  propertyName: 'Property Updated',
  propertyStatus: 'vacant',
}
const updatePropertyReturn = {
  id: 1,
  name: 'Property Updated',
  street: '1 First St',
  city: 'Salt Lake City',
  state: 'Utah',
  zip: '84101',
  status: 'vacant',
  image: null,
  landlordId: 1,
}

//#endregion

// #region - Tenant History variables

const tenanthistory = []
seedData.tenanthistory.forEach((x, i) => {
  tenanthistory.push({id: i + 1, ...x})
})

const tenantHistory = {
  id: 2,
  tenantId: 3,
  propertyId: 1,
  startDate: '01/01/2010',
  endDate: null,
}
const addTenantHistoryInput = {
  tenantId: 5,
  propertyId: 1,
  historyStartdate: '12-31-2018',
}
const addTenantHistoryReturn = {
  id: 9,
  tenantId: 5,
  propertyId: 1,
  startDate: '12/31/2018',
  endDate: null,
}
const updateTenantHistoryInput = {
  endDate: '12-31-2010',
}
const updateTenantHistoryReturn = {
  id: 2,
  tenantId: 3,
  propertyId: 1,
  startDate: '01/01/2010',
  endDate: '12/31/2010',
}

//#endregion

// #region - Work Order variables

const workorders = []
seedData.workorders.forEach((x, i) => {
  workorders.push({id: i + 1, ...x})
})

const addWorkorderInput = {
  title: 'Short Description',
  description: 'Description of the issue.',
  type: 'electrical',
  startDate: '01-01-2020',
  endDate: null,
  propertyId: 1,
}
const addWorkorderReturn = {
  id: 4,
  title: 'Short Description',
  description: 'Description of the issue.',
  type: 'electrical',
  startDate: '01-01-2020',
  endDate: null,
  propertyId: 1,
  createdBy: 5,
}
const updateWorkorderInput = {
  endDate: '01-20-2020',
}
const updateWorkorderReturn = {
  id: 3,
  title: 'Third Workorder',
  description: 'Description of the issue.',
  type: 'plumbing',
  startDate: '01-16-2020',
  endDate: '01-20-2020',
  propertyId: 7,
  createdBy: 5,
}

//#endregion

// #region - Work Order History variables

//#endregion

function fromJSON(obj) {
  return JSON.stringify(obj, undefined, 2)
}

const docs = {
  header: 'Property Manager Backend',
  address: 'https://pt6-propman.herokuapp.com', // website address
  changes: [
    // changes should be an array of strings, these strings will become list items
    'Updateing User endpoints for Tenants',
    'Adding Work Order Models, Endpoints, and Table Example',
  ],
  planning: [
    // planning should be an array of html strings, these strings will be joined with a line break between each.
    '<h2>PropMan Links</h2>',
    'Front-End: <a href="https://propman.netlify.com/">Propman - Property Management</a> <br />',
    'Back-End: <a href="https://pt6-propman.herokuapp.com/">Property Manager Backend</a> <br />',
    '<br />',
    '<strong>Notion Product Board</strong>  <br />',
    '<a href="https://www.notion.so/Property-Manager-bd4c33b5c8974b8aa938512b993f9108">Property Manager</a> <br />',
    '<br />',
    '<strong>Trello Boards</strong> <br />',
    '<a href="https://trello.com/b/mKfgx81y/property-manager">Property Manager</a> <br />',
    '<a href="https://trello.com/b/llCWH1QF/property-manager-retrospective">Property Manager Retrospective</a> <br />',
    '<br />',
    '<strong>GitHub</strong> <br />',
    '<a href="https://github.com/Lambda-School-Labs/property-manager-fe">Front-End</a> <br />',
    '<a href="https://github.com/Lambda-School-Labs/property-manager-be">Back-End</a> <br />',
    '<br />',
    '<a href="https://www.figma.com/file/Mtjt9s7kxfGmh6fIgEszRY/PropMan">PropMan – Figma</a> <br />',
    '<a href="https://docs.google.com/document/d/1bYrgvbAEnnRviKBgIuJjOvdBhLfcCzw5stIwvk0ErM8">Labs Sprint Rubric</a> <br />',
  ],
  colorkey: {
    // colorkey in docs file should be an object
    // css class name: "Comment String"
    codesnip: 'Code - lightgreen',
    todo: 'ToDo - yellow',
    alert: 'Alert - red',
    comment: 'Commnet - lightseagreen',
  },
  menu: {
    planning: {
      tag: 'h1',
      onclick: "{showContent('planning')}",
      content: 'Planning',
    },
    developmentBE: {
      tag: 'h1',
      onclick: "{showContent('developmentBE')}",
      content: 'Development Back End',
      subSections: [
        {
          section: 'models',
          tag: 'h2',
          class: 'moreInfo',
          onclick: "{showContent('models')}",
          content: '<button>v</button> Models',
        },
        {
          section: 'endpoints',
          tag: 'h2',
          class: 'moreInfo',
          onclick: "{showContent('endpoints')}",
          event: 'displayEndpoints',
          content: '<button>v</button> Endpoints',
          subHeaders: [
            {
              section: 'userEndpoints',
              tag: 'h3',
              class: 'moreInfo',
              onclick: "{showContent('userEndpoints')}",
              docs: 'docs.endpoints.User',
              content: 'User Endpoints',
            },
            {
              section: 'propertyEndpoints',
              tag: 'h3',
              class: 'moreInfo',
              onclick: "{showContent('propertyEndpoints')}",
              docs: 'docs.endpoints.Property',
              content: 'Property Endpoints',
            },
            {
              section: 'tenantHistoryEndpoints',
              tag: 'h3',
              class: 'moreInfo',
              onclick: "{showContent('tenantHistoryEndpoints')}",
              docs: 'docs.endpoints.TenantHistory',
              content: 'Tenant History Endpoints',
            },
            {
              section: 'workorderEndpoints',
              tag: 'h3',
              class: 'moreInfo',
              onclick: "{showContent('workorderEndpoints')}",
              docs: 'docs.endpoints.Workorder',
              content: 'Work Order Endpoints',
            },
            {
              section: 'sampleEndpoints',
              tag: 'h3',
              class: 'moreInfo',
              onclick: "{showContent('sampleEndpoints')}",
              docs: 'docs.endpoints.Sample',
              content: 'Sample Endpoints',
            },
          ],
        },
        {
          section: 'database',
          tag: 'h2',
          class: 'moreInfo',
          onclick: "{showContent('database')}",
          event: 'displayDatabase',
          content: '<button>v</button> Database Structures',
          subHeaders: [
            {
              section: 'tables',
              tag: 'h3',
              class: 'moreInfo',
              onclick: "{showContent('tables')}",
              docs: 'docs.database.tables',
              content: 'Tables',
            },
          ],
        },
      ],
    },
  },
  models: {
    User: {
      function: 'modelsUsers()',
      examples: users,
    },
    Property: {
      function: 'modelsProperty()',
      examples: properties,
    },
    'Tenant History': {
      function: 'modelsTenantHistory()',
      examples: tenantHistory,
    },
    'Work Orders': {
      function: 'modelsWorkorders()',
      examples: workorders,
    },
    // 'Work Order History': {
    //   function: "test()",
    //   examples: [
    //     {}
    //   ]
    // },
  },
  endpoints: {
    User: {
      Register: {
        header: 'User Endpoints - Register',
        todo: '',
        comment: '',
        endpoint: '/api/auth/register',
        type: 'POST',
        description: 'Register a new user',
        expectedInput: registerInput,
        sampleRequest: {
          axiosThen: 'token => console.log&lpar;token&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: registerReturn,
        expectedFailedReturn: '', // TODO: if Fails
      },
      Login: {
        header: 'User Endpoints - Login',
        todo: '',
        comment: '',
        endpoint: '/api/auth/login',
        type: 'POST',
        description: 'Login user',
        expectedInput: LoginInput,
        sampleRequest: {
          axiosThen: 'token => console.log&lpar;token&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: LoginReturn,
        expectedFailedReturn: '', // TODO: if Fails
      },
      // 'Update User': {
      //   header: "User Endpoints - Update User",
      //   todo: "TODO",
      //   comment: "",
      //   endpoint: "",
      //   type: "",
      //   description: "",
      //   expectedInput: { },
      //   sampleRequest: { },
      //   expectedReturn: { },
      //   expectedFailedReturn: ""
      // },
      // 'Delete User': {
      //   header: "User Endpoints - Delete User",
      //   todo: "TODO",
      //   comment: "",
      //   endpoint: "",
      //   type: "",
      //   description: "",
      //   expectedInput: { },
      //   sampleRequest: { },
      //   expectedReturn: { },
      //   expectedFailedReturn: ""
      // }
    },
    Property: {
      Add: {
        header: 'Add a Property',
        todo: '',
        comment: '',
        endpoint: '/api/properties/',
        type: 'post',
        description: 'Adds a Property to the database.',
        expectedInput: addPropertyInput,
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: addPropertyReturn,
        expectedFailedReturn: {message: 'Failed to create new property.'},
      },
      Get: {
        header: 'Get a Property',
        todo: '',
        comment: '',
        endpoint: '/api/properties/:id',
        type: 'get',
        description: 'Returns an object based on the Property id.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: properties[0],
        expectedFailedReturn: {message: 'Failed to get results.'},
      },
      GetAll: {
        header: 'Get All Properties',
        todo: '',
        comment: '',
        endpoint: '/api/properties/',
        type: 'GET',
        description: 'Returns an array of all Properties in the database.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'token => console.log&lpar;token&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: fromJSON(properties),
        expectedFailedReturn: {message: 'Failed to get results.'},
      },
      GetAllUser: {
        header: 'Get All Properties for User',
        todo: '',
        comment: '',
        endpoint: '/api/properties/user/:email',
        type: 'GET',
        description: 'Returns an array of all Properties for User.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'token => console.log&lpar;token&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: fromJSON(properties),
        expectedFailedReturn: {message: 'Failed to get results.'},
      },
      Update: {
        header: 'Update a Property',
        todo: '',
        comment: '',
        endpoint: '/api/properties/:id',
        type: 'put',
        description: 'Updates a Property based on property id.',
        expectedInput: updatePropertyInput,
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: updatePropertyReturn,
        expectedFailedReturn: {message: 'Failed to update the property.'},
      },
      Delete: {
        header: 'Delete a Property',
        todo: '',
        comment:
          'Currently this will not delete if property is linked in another database. This function should be added, or maybe a way to archive property.',
        endpoint: '/api/properties/:id',
        type: 'delete',
        description:
          'Deletes a Property based on property id, and returns the property information.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: properties[1],
        expectedFailedReturn: {message: 'Failed to delete property.'},
      },
    },
    TenantHistory: {
      Add: {
        header: 'Add Entry',
        todo: '',
        comment: '',
        endpoint: '/api/history/',
        type: 'post',
        description: 'Add Entry for Tenant History',
        expectedInput: addTenantHistoryInput,
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: addTenantHistoryReturn,
        expectedFailedReturn: {message: 'Failed to create new entry.'},
      },
      Get: {
        header: 'Get by Id',
        todo: '',
        comment: '',
        endpoint: '/api/history/:id',
        type: 'get',
        description: 'Get tenant history results for given id.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: tenantHistory,
        expectedFailedReturn: {message: 'Failed to get results for given id.'},
      },
      GetByProperty: {
        header: 'Get Results by Property',
        todo: '',
        comment: '',
        endpoint: '/api/history/property/:id',
        type: 'get',
        description:
          'Get all tenant history results for property, by property id.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: [tenantHistory],
        expectedFailedReturn: {
          message: 'Failed to get results for given property id.',
        },
      },
      GetByTenant: {
        header: 'Get Results by Tenant',
        todo: '',
        comment: '',
        endpoint: '/api/history/tenant/:id',
        type: 'get',
        description: 'Get all tenant history results for tenant.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: [tenantHistory],
        expectedFailedReturn: {
          message: 'Failed to get results for given tenant id.',
        },
      },
      Update: {
        header: 'Update Entry',
        todo: '',
        comment: '',
        endpoint: '/api/history/:id',
        type: 'put',
        description: 'Update Entry for Tenant History by Id',
        expectedInput: updateTenantHistoryInput,
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: updateTenantHistoryReturn,
        expectedFailedReturn: [
          {message: 'Could not find entry with given id.'},
          {message: 'Failed to update the entry.'},
        ],
      },
      Delete: {
        header: 'Delete Entry',
        todo: '',
        comment: '',
        endpoint: '/api/history/:id',
        type: 'delete',
        description: 'Delete Entry for Tenant History by Id',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: tenantHistory,
        expectedFailedReturn: [
          {message: 'Could not delete entry.'},
          {message: 'Could not find entry with given id.'},
          {message: 'Failed to delete entry.'},
        ],
      },
    },
    Workorder: {
      Add: {
        header: 'Add a Work order',
        todo: '',
        comment: '',
        endpoint: '/api/workorders/',
        type: 'post',
        description: 'Adds a Work order to the database.',
        expectedInput: addWorkorderInput,
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: addWorkorderReturn,
        expectedFailedReturn: {message: 'Failed to create new work order.'},
      },
      Get: {
        header: 'Get a Work order',
        todo: '',
        comment: '',
        endpoint: '/api/workorders/:id',
        type: 'get',
        description: 'Returns an object based on the Work Order id.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: workorders[0],
        expectedFailedReturn: {message: 'Failed to get results.'},
      },
      GetAll: {
        header: 'Get All Work Orders',
        todo: '',
        comment: '',
        endpoint: '/api/workorders/',
        type: 'GET',
        description: 'Returns an array of all Work Orders in the database.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'token => console.log&lpar;token&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: fromJSON(workorders),
        expectedFailedReturn: {message: 'Failed to get results.'},
      },
      Update: {
        header: 'Update a Work Order',
        todo: '',
        comment: '',
        endpoint: '/api/workorders/:id',
        type: 'put',
        description: 'Updates a work order based on id.',
        expectedInput: updateWorkorderInput,
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: updateWorkorderReturn,
        expectedFailedReturn: {message: 'Failed to update the workorder.'},
      },
      Delete: {
        header: 'Delete a Work Order',
        todo: '',
        comment: '',
        endpoint: '/api/workorders/:id',
        type: 'delete',
        description:
          'Deletes a work order based on the id, and returns the work order information.',
        expectedInput: '',
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: workorders[1],
        expectedFailedReturn: {message: 'Failed to delete work order.'},
      },
    },
    Sample: {
      // Add: {
      //   header: "Add a ",
      // },
      Get: {
        header: 'This is a Sample for Documentation Only.',
        todo: 'This is still Todo.',
        comment: 'This is a comment.',
        endpoint: '/api/sample/',
        type: 'post',
        description: 'Description of the Endpoint',
        expectedInput: {
          sample: 'this is a sample object',
          object: {
            can: 'can have an object inside an object.',
          },
        },
        sampleRequest: {
          axiosThen: 'response => console.log&lpar;response&rpar;',
          axiosCatch: 'err => console.error&lpar;err&rpar;',
        },
        expectedReturn: 'Expected Return',
        expectedFailedReturn: 'Expected Return if Fails.',
      },
      // Update: {
      //   header: "Update a ",
      // },
      // Delete: {
      //   header: "Delete a ",
      // }
    },
  },
  database: {
    tables: {
      user: {
        header: 'Users Table',
        todo: '',
        comment: '',
        table: {
          id: 'integer -> increment number assigned by database',
          email: 'string, not Null, unique',
          type:
            'string, not Null -> (expects one of these:) landlord, tenant, dev',
          firstName: 'string',
          lastName: 'string',
          phone: 'string',
        },
      },
      properties: {
        header: 'Properties Table',
        todo: '',
        comment: "Status options may include: 'vacant' or 'occupied'", // changed from open, closed, occupied, forRent, or forSale
        table: {
          id: 'integer -> increment number assigned by database',
          name: 'string, not Null',
          street: 'string, not Null',
          city: 'string, not Null',
          state: 'string, not Null',
          zip: 'string, not Null',
          status: "enum ->, 'vacant' or 'occupied'",
          image: 'string, can be null',
          landlordId: "integer -> references id in table 'users'",
        },
      },
      tenantHistory: {
        header: 'Tenant History Table',
        todo: 'Updating This',
        comment: '',
        table: {
          id: 'integer -> increment number assigned by database',
          tenantId: "integer -> references id in table 'users'",
          propertyId: "integer -> references id in table 'properties'",
          startDate: "date, can be 'null'",
          endDate: "date, can be 'null'",
        },
      },
      workOrders: {
        header: 'Work Order Table',
        todo: '',
        comment: '',
        table: {
          id: 'integer -> increment number assigned by database',
          title: 'string -> Work Order Title',
          description: 'text -> Description of the issue.',
          type: 'enum -> electrical, plumbing, HVAC, pest control, appliances',
          startDate: 'date -> from a timestamp',
          endDate: "date -> can be 'null'",
          propertyId: "integer -> references id in table 'properties'",
          createdBy: "integer -> references id in table 'users'",
        },
      },
      woHistory: {
        header: 'Work Order History Table',
        todo: '',
        comment: '',
        table: {
          id: 'integer -> increment number assigned by database',
          woId: "integer -> references id in table 'workorders'",
          status:
            'enum -> new, acknowledged, assigned, sending, review, or closed',
          urgency: 'enum -> low, medium, or high',
          assignedTo: 'string -> Name of Company task assigned to, can be null',
          comment: 'string -> comment if needed, may be null',
          updatedate: 'timestamp',
        },
      },
      // other: {
      //   header: "Other Table",
      //   todo: "",
      //   comment: "",
      //   table: {}
      // }
    },
  },
}

module.exports = docs
