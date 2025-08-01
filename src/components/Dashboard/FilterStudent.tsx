import { DatePicker, Select, Card, Form, Row, Col, Button } from "antd";
import type { FilterValues } from "../../types/filterTypes";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface filtersProps {
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;
}

const FilterStudent = ({ filters, setFilters }: filtersProps) => {
  const [form] = Form.useForm();

  const resetForm = () => {
    form.resetFields();
    setFilters({
      course: null,
      region: null,
      dateRange: null,
    });
  };

  const handleFinish = (values: FilterValues) => {
    setFilters(values); // بس لما يضغط Apply
  };

  return (
    <Card title="Filter Students" className="mb-4 shadow-md rounded-xl">
      <Form
        layout="vertical"
        form={form}
        initialValues={filters}
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          {/* Course Filter */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Course" name="course">
              <Select placeholder="Select course" allowClear>
                <Option value="Frontend">Frontend</Option>
                <Option value="Backend">Backend</Option>
                <Option value="Full Stack">Full Stack</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Region Filter */}
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Region" name="region">
              <Select placeholder="Select region" allowClear>
                <Option value="Cairo">Cairo</Option>
                <Option value="Giza">Giza</Option>
                <Option value="Alexandria">Alexandria</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Date Range Filter */}
          <Col xs={24} sm={24} md={8}>
            <Form.Item label="Created Date" name="dateRange">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row justify="end" gutter={16}>
          <Col>
            <Button type="default" onClick={resetForm}>
              Reset
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Apply Filter
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FilterStudent;
