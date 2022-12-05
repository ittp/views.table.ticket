import type { ProColumns } from "@ant-design/pro-components";
import {
  EditableProTable,
  ProCard,
  ProFormField,
  ProFormRadio
} from "@ant-design/pro-components";
import Form from "antd/es/form/Form";

import React, { useState } from "react";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let DeviceTypes = {
  models: [
    {
      label: "",
      value: ""
    }
  ],
  types: [
    {
      label: "Оригинальный",
      value: "1"
    },
    {
      label: "Совместимый",
      value: "2"
    },
    {
      label: "Другой",
      value: "0"
    }
  ]
};

type DataSourceType = {
  id: React.Key;
  title?: string;
  readonly?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: "1",
    readonly: "1",
    decs: "www",
    state: "open",
    created_at: "1590486176000",
    update_at: "1590486176000"
  },
  {
    id: 624691229,
    title: "Kyocera",
    readonly: "Оригинальный",
    decs: "top",
    state: "closed",
    created_at: "1590481162000",
    update_at: "1590481162000"
  }
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
  const [position, setPosition] = useState<"top" | "bottom" | "hidden">(
    "bottom"
  );

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "title",
      dataIndex: "title",
      tooltip: "只读，使用form.getFieldValue获取不到值",
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: "此项为必填项" }] : []
        };
      },
      // 第一行不允许编辑
      editable: (text, record, index) => {
        return index !== 0;
      },
      width: "15%"
    },
    {
      title: "活动名称二",
      dataIndex: "readonly",
      tooltip: "只读，使用form.getFieldValue可以获取到值",
      readonly: true,
      width: "15%"
    },
    {
      title: "State",
      key: "state",
      dataIndex: "state",
      valueType: "select",
      valueEnum: {
        all: { text: "Default", status: "Default" },
        open: {
          text: "Error",
          status: "Error"
        },
        closed: {
          text: "Success",
          status: "Success"
        }
      }
    },
    {
      title: "描述",
      dataIndex: "decs",
      fieldProps: (form, { rowKey, rowIndex }) => {
        if (form.getFieldValue([rowKey || "", "title"]) === "不好玩") {
          return {
            disabled: true
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true
          };
        }
        return {};
      }
    },
    {
      title: "created_at",
      dataIndex: "created_at",
      valueType: "date"
    },
    {
      title: "Actions",
      valueType: "option",
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Edit
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          Delete
        </a>
      ]
    }
  ];

  return (
    <>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="Devices"
        maxLength={5}
        scroll={{
          x: 960
        }}
        recordCreatorProps={
          position !== "hidden"
            ? {
                position: position as "top",
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) })
              }
            : false
        }
        loading={false}
        toolBarRender={() => [
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value)
            }}
            options={[
              {
                label: "Оригинальный",
                value: "top"
              },
              {
                label: "Совместимый",
                value: "bottom"
              },
              {
                label: "隐藏",
                value: "hidden"
              }
            ]}
          />
        ]}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: "multiple",
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
          },
          onChange: setEditableRowKeys
        }}
      />

      <Form></Form>

      <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
        <ProFormField
          ignoreFormItem
          fieldProps={{
            style: {
              width: "100%"
            }
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
    </>
  );
};
