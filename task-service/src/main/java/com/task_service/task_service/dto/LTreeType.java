package com.task_service.task_service.dto;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

public class LTreeType implements UserType<String> {

    @Override
    public int getSqlType() {
        return Types.OTHER;
    }

    @Override
    public Class<String> returnedClass() {
        return String.class;
    }

    @Override
    public boolean equals(String s, String j1) {
        return Objects.equals(s,j1);
    }

    @Override
    public int hashCode(String s) {
        return Objects.hashCode(s);
    }

    @Override
    public String nullSafeGet(ResultSet resultSet, int i, SharedSessionContractImplementor sharedSessionContractImplementor, Object o) throws SQLException {
        return resultSet.getString(i);
    }

    @Override
    public void nullSafeSet(PreparedStatement preparedStatement, String s, int i, SharedSessionContractImplementor sharedSessionContractImplementor) throws SQLException {
        if (s == null) {
            preparedStatement.setNull(i, Types.OTHER);
        } else {
            preparedStatement.setObject(i, s, Types.OTHER);
        }
    }

    @Override
    public String deepCopy(String s) {
        return s;
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(String s) {
        return s;
    }

    @Override
    public String assemble(Serializable serializable, Object o) {
        return (String) o;
    }
}
