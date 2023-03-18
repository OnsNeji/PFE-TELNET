export enum Functions {
    // Human Resources Rights
    Employees = '2', // '-1'
    Leave = '7', // '-1'
    AddLeave = '8', // '-1'
    Leaves = '18', // '-1'
    ValidateLeave = '461', // '-1'
    Attendance = '370', // '-1'
    WorkFromHome = '7', // '-1'

    // Projects Rights
    Project = '41',
    Projects = '47',
    AddProject = '601',
    ProjectDetails = '51',
    Estimation = '53',
    Order = '52',
    InvoicingBatch = '54',
    Invoice = '55',
    References = '701',
    Missions = '141', // '141',
    Timesheet = '43',
    TimeEntry = '44',
    Board = '186',
    TimeEntryReport = '10522',
    Invoicing = '123',
    Estimations = '124',
    Invoices = '184',
    Batches = '481',
    Costing = '10081', // 81
    ResourceCost = '10082', // 82
    Indicator = '45',
    LoadPlan = '46',
    ProfitabilityActivity = '10062', // 62
    ProfitabilityProject = '10064', // 64
    ProfitabilityResource = '10522', // 522
    InvoicedWorkload = '163',
    AnalyticsReports = '10082', // 82

    // Flex office Rights
    OfficeSettings = '186',
    DeskReservation = '186',
    Desks = '186',
    Platforms = '186',
    Blocks = '186',
}

export enum Groups {
    SuperAdmin = 2,
    ProjectManager = 21,
    TeamLeader = 22,
    Developer = 23,
    Validator = 24,
    Finance = 82,
    Facturation = 101
}

export enum Qualifications {
    Engineer = 1,
    DepartmentHead = 21,
    Director = 22,
    Administrative = 23,
    ProjectManager = 25,
}

export enum Activities {
    Administration = 81,
    Quality = 101,
    ExecutiveManagement = 201
}

export enum Roles {
    SQA = 22,
    Developper = 24
}
