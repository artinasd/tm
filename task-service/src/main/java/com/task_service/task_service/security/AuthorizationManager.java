package com.task_service.task_service.security;

import com.task_service.task_service.dto.OrganizationDTO;
import com.task_service.task_service.entity.*;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.OrganizationMapper;
import com.task_service.task_service.repository.*;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.util.EnumSet;
import java.util.Set;

import static com.task_service.task_service.security.ActionType.*;

@Component
public class AuthorizationManager {

    @Autowired
    private EmploymentRepository employmentRepository;
    @Autowired
    private UnitRepository unitRepository;
    @Autowired
    private OrganizationRepository orgRepository;
    @Autowired
    private OrganizationMapper orgMapper;

    public void checkAccess(String clientAccountCode, @Nullable String placeCode, String ownerAccountCode, ActionType action) throws AccessDeniedException {
        if (placeCode == null) {
            Set<ActionType> noPlaceForbiddenActions = EnumSet.of(
                    DELETE_MESSAGE, EDIT_MESSAGE, DELETE_MESSAGE_FORALL,
                    CREATE_TASK, DELETE_TASK, EDIT_TASK, VIEW_TASK,
                    EDIT_CHATROOM_INFO, ADD_MEMBER, REMOVE_MEMBER, PROMOTE_MEMBER, DEMOTE_MEMBER, CHANGE_OWNER,
                    CREATE_EMPLOYEE, DELETE_EMPLOYEE, EDIT_EMPLOYEE,
                    CREATE_EMPLOYMENT, DELETE_EMPLOYMENT, EDIT_EMPLOYMENT, VIEW_EMPLOYMENT, PROMOTE_EMPLOYMENT, DEMOTE_EMPLOYMENT, CHANGE_BOSS,
                    EDIT_ORGANIZATION, GET_ORGANIZATION_DETAILS,
                    CREATE_UNIT, DELETE_UNIT, EDIT_UNIT, VIEW_UNIT, VIEW_ALL_UNITS
            );

            if (!clientAccountCode.equals(ownerAccountCode)){
                Set<ActionType> noneOwnerForbiddenActions = EnumSet.of(DELETE_CHATROOM, DELETE_ORGANIZATION, EDIT_ACCOUNT);
                if (noPlaceForbiddenActions.contains(action) || noneOwnerForbiddenActions.contains(action))
                    throw new AccessDeniedException("access denied!!!");
            }

        } else if (placeCode.startsWith("Unit")) {
            Unit unit = unitRepository.findByUnitCode(placeCode);
            Employment employment = employmentRepository.findByUnit_UnitCodeAndEmployee_Account_AccountCode(placeCode,clientAccountCode);

            if (employment == null)
                if (!unit.getBoss().getAccount().getAccountCode().equals(clientAccountCode))
                    throw new EntityNotFound("Employment", "Account Code", clientAccountCode);

            Set<ActionType> unitForbiddenActions = EnumSet.of(
                    EDIT_ACCOUNT, VIEW_ACCOUNT,
                    CREATE_ORGANIZATION, DELETE_ORGANIZATION, EDIT_ORGANIZATION, VIEW_ORGANIZATION, GET_ORGANIZATION_DETAILS,
                    CREATE_CHATROOM, DELETE_CHATROOM, EDIT_CHATROOM_INFO, ADD_MEMBER, REMOVE_MEMBER, PROMOTE_MEMBER, DEMOTE_MEMBER, CHANGE_OWNER,
                    CREATE_EMPLOYEE, DELETE_EMPLOYEE, EDIT_EMPLOYEE, VIEW_EMPLOYEE,
                    VIEW_ALL_UNITS,
                    DELETE_MESSAGE, EDIT_MESSAGE, DELETE_MESSAGE_FORALL
            );

            if (clientAccountCode.equals(ownerAccountCode)){
                Set<ActionType> ownerForbiddenActions = EnumSet.of(DELETE_EMPLOYMENT, EDIT_EMPLOYMENT, PROMOTE_EMPLOYMENT, DEMOTE_EMPLOYMENT);
                if (unitForbiddenActions.contains(action) || ownerForbiddenActions.contains(action))
                    throw new AccessDeniedException("Access Denied!!!");
            } else if (employment.getRole().getName().equals("ADMIN")) {
                Employment targetEmployment = employmentRepository.findByUnit_UnitCodeAndEmployee_Account_AccountCode(placeCode, ownerAccountCode);
                // TODO: there must be a list of actions here that admin can not do to others
                if (action.equals(DELETE_EMPLOYMENT)){
                    if (targetEmployment.getRole().getName().equals("ADMIN") || targetEmployment.getRole().getName().equals("OWNER"))
                        throw new AccessDeniedException("Access Denied!!!");
                } else if (unitForbiddenActions.contains(action))
                    throw new AccessDeniedException("Access Denied!!!");
            } else {
                if (unitForbiddenActions.contains(action) || !employment.getRole().getPermissions().contains(action) || action.equals(EDIT_TASK))
                    throw new AccessDeniedException("Access Denied");
            }
        } else if (placeCode.startsWith("Org")) {
            Set<ActionType> orgForbiddenActions = EnumSet.of(
                    DELETE_MESSAGE, EDIT_MESSAGE, DELETE_MESSAGE_FORALL,
                    CREATE_TASK, DELETE_TASK, EDIT_TASK, VIEW_TASK,
                    CREATE_CHATROOM, DELETE_CHATROOM, EDIT_CHATROOM_INFO, ADD_MEMBER, REMOVE_MEMBER, PROMOTE_MEMBER, DEMOTE_MEMBER,
                    CREATE_EMPLOYMENT, DELETE_EMPLOYMENT, EDIT_EMPLOYMENT, VIEW_EMPLOYMENT, PROMOTE_EMPLOYMENT, DEMOTE_EMPLOYMENT,
                    EDIT_ACCOUNT, VIEW_ACCOUNT
            );
            Set<ActionType> justOwnerActions = EnumSet.of(DELETE_ORGANIZATION, EDIT_ORGANIZATION, CHANGE_OWNER);
            if (clientAccountCode.equals(ownerAccountCode)){
                if (orgForbiddenActions.contains(action))
                    throw new AccessDeniedException("Access Denied!!!");
                return;
            }
            OrganizationDTO organization = orgMapper.toDTO(orgRepository.findByOrgCode(placeCode));
            if (!organization.getEmployeesAccountCode().contains(clientAccountCode))
                throw new AccessDeniedException("Access Denied!!!");
        }

    }
}
