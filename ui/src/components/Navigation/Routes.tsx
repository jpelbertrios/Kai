import ViewGraph from '../ViewGraph/ViewGraph';
import AddGraph from '../AddGraph/AddGraph';
import UserGuide from '../UserGuide/UserGuide';
import SchemaBuilder from '../SchemaBuilder/SchemaBuilder';

const Routes = [
   
    {
        path: '/AddGraph',
        sidebarName: 'Add Graph',
        component: AddGraph,
    },
    {
        path: '/ViewGraph',
        sidebarName: 'View Graphs',
        component: ViewGraph,
    },
    {
        path: '/SchemaBuilder',
        sidebarName: 'Build a new schema',
        component: SchemaBuilder,
    },
    {
        path: '/UserGuide',
        sidebarName: 'User Guide',
        component: UserGuide,
    },
];

export default Routes;
