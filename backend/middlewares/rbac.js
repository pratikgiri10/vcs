import { Role } from '../utils/role.js';
import { Permissions } from '../utils/permissions.js';


export function checkPermission(permission){
    return (req,res,next) => {
        const userRole = req.session.user.role;
        const userPermission = new Permissions().getPermissionsByRoleName(userRole);
        if(userPermission.includes(permission)){
            return next();
        }else{
            return res.status(403).json({eror: 'Access Denied'});
        }
    }
}