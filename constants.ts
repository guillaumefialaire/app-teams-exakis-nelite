export const Constants = {
    lists: {
        customers: {
            url: "/Lists/Customers",

            fields: {
                id : "ID",
                name: "Title",
                businessSector : "BusinessSector",
            },
            publishingFields : {
                logo: "Logo"
            }
        },
        projects: {
            url: "/Lists/Projects",

            fields: {
                id : "ID",
                name: "Title",
                description : "DescriptionField",
                outsideCustomer :"OutsideCustomer",
                businessSector : "BusinessSector",
                projectType : "ProjectType",
                technos : "Technos",
                customer  : "CustomerId"
        }
    },
    profiles: {
        url : "/Lists/Profiles",

        fields: {
            id : "ID",
            date : "ActivityStartDate",
            user : "User1Id", 
            jobTitle : "JobTitle1",
            branch : "Branch",
            serviceLine : "ServiceLine",
            introduction : "Presentation", 
            skills : "Skills",
            certifications : "CertificationsId",
            interventions : "InterventionsId",
        },
    },
    technos:{
        url: "/Lists/Technos",

        fields:{
            id : "ID",
            name : "TechnoName",
            level : "Level",
            profile : "ProfileId"
        }
    },
    languages:{
        url: "/Lists/SpokenLanguages",

        fields:{
            id : "ID",
            name : "LanguageName",
            level : "Level",
            profile : "ProfileId"
        }
    },
    softskills:{
        url: "/Lists/Softskills",

        fields:{
            id : "ID",
            name : "SoftskillName",
            level : "Level",
            profile : "ProfileId"
        }
    },
    graduations:{
        url: "/Lists/Graduations",

        fields:{
            id : "ID",
            name : "GraduationName",
            diploma : "Diploma",
            school : "School",
            graduationDate : "GraduationDate",
            profile : "ProfileId"
        }
    },
    certifications:{
        url: "/Lists/Certifications",

        fields:{
            id : "ID",
            name : "CertificationName",
            description: "DescriptionField",
            company : "CompanyName"
        }
    },
    interventions:{
        url:"/Lists/Interventions",

        fields:{
            id:"ID",
            startDate : "InterventionStartDate",
            duration : "Duration1",
            roles : "InterventionRole",
            type : "InterventionTypes",
            mission : "Mission",
            technos : "Technos",
            includeInCV : "IncludeInCV",
            // profiles : "ProfilesId",
            project : "ProjectId"

        }
    }
    },
    documents: {
        logos: "/Shared%20Documents/Customers/Logos/"
    },
    termsets: {
        businessSector : {
            id : 'bbd3b5c9-8781-4294-a1ce-43f1cd066579',
            staticName : 'a1c1709ce6c04541ac20939437f2f5b9'
        },
        projectType : {
            id : '209fc398-2562-459d-88bc-ab8c9c8d9323',
            staticName : 'o91ffc997d0d4e499eed2ef49ab6c4c0'
        },
        techno : {
            id : '97551771-e722-45fc-bc81-6be0389e7792',
            staticName : 'l796a0b73e5344cb82d8d8ca3c49fc33'
        },
        language : {
            id : 'd2d19179-676c-4d78-b069-55563377e9b1'
        },
        softskill : {
            id : '1bd37c7a-69be-4033-80d5-0235e6ab5967'
        },
        diploma : {
            id : '8800a06b-ca4e-4b47-948f-054ab600bb1b'
        },
        school : {
            id : '093dc2f1-8c77-4835-8510-b05a9c3ee348'
        },
        branch : {
            id : '2888afd2-33a0-40e3-ae1c-b92f14fa9c55'
        },
        serviceLine : {
            id : '4a19daf0-cf66-419e-bcba-4814df655e33'
        },
        company : {
            id : 'bd1ab22b-674f-42c3-a070-46ae96faf2df'
        },
        interventionRoles : {
            id : 'aca90e84-4e0f-4b2e-be27-f808ec2a6809',
            staticName : 'j62b0da58697448fbb13df38542ac523'
        }
    }
};