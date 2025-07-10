import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RentingForm from "../Rentings/RentingForm";
import * as api from "../../api/api";
import useNotify from "../Notification/useNotify";
import '@testing-library/jest-dom';

jest.mock("../../api/api");
jest.mock("../Notification/useNotify");

describe("RentingForm", () => {
  const mockNotify = {
    error: jest.fn(),
    warning: jest.fn(),
    success: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNotify.mockReturnValue(mockNotify);
  });

  const usersMock = [
    { id: 1, userName: "Alice" },
    { id: 2, userName: "Bob" },
  ];

  const storageUnitsMock = [
    { id: 10, name: "Unit A", sizeInM2: 10, pricePerMonth: 100, available: true },
    { id: 11, name: "Unit B", sizeInM2: 20, pricePerMonth: 200, available: false },
    { id: 12, name: "Unit C", sizeInM2: 15, pricePerMonth: 150, available: true },
  ];

  test("loads users and storage units and displays them in selects", async () => {
    api.fetchUsers.mockResolvedValue({ data: usersMock });
    api.fetchStorageUnits.mockResolvedValue({ data: storageUnitsMock });

    render(<RentingForm onClose={jest.fn()} />);

    await waitFor(() => {
      expect(api.fetchUsers).toHaveBeenCalled();
      expect(screen.getByRole("option", { name: /Alice/ })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /Bob/ })).toBeInTheDocument();
    });

    expect(api.fetchStorageUnits).toHaveBeenCalled();
    expect(screen.getByRole("option", { name: /Unit A/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Unit B/ })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Unit C/ })).toBeInTheDocument();
  });

  test("shows validation errors and warns on submit with empty fields", async () => {
    api.fetchUsers.mockResolvedValue({ data: usersMock });
    api.fetchStorageUnits.mockResolvedValue({ data: storageUnitsMock });

    render(<RentingForm onClose={jest.fn()} />);

    await waitFor(() => expect(api.fetchUsers).toHaveBeenCalled());

    fireEvent.click(screen.getByText("Create"));

    expect(await screen.findByText("Please select a user.")).toBeInTheDocument();
    expect(screen.getByText("Please select a storage unit.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a start date.")).toBeInTheDocument();
    expect(screen.getByText("Please enter an end date.")).toBeInTheDocument();

    expect(mockNotify.warning).toHaveBeenCalledWith(
      expect.stringContaining("Please select a user.")
    );
  });

  test("shows date validation error if startDate > endDate", async () => {
    api.fetchUsers.mockResolvedValue({ data: usersMock });
    api.fetchStorageUnits.mockResolvedValue({ data: storageUnitsMock });

    render(<RentingForm onClose={jest.fn()} />);

    await waitFor(() => expect(api.fetchUsers).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText("User:"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Storage Unit:"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Start Date:"), { target: { value: "2024-12-31" } });
    fireEvent.change(screen.getByLabelText("End Date:"), { target: { value: "2024-01-01" } });

    fireEvent.click(screen.getByText("Create"));

    expect(await screen.findByText("Start date must be before end date.")).toBeInTheDocument();
    expect(mockNotify.warning).toHaveBeenCalledWith(
      expect.stringContaining("Start date must be before end date.")
    );
  });

  test("calls updateRentings and notifies on successful update", async () => {
    api.fetchUsers.mockResolvedValue({ data: usersMock });
    api.fetchStorageUnits.mockResolvedValue({ data: storageUnitsMock });
    api.updateRentings.mockResolvedValue({});

    const editingRenting = {
      id: 9,
      user: { id: 2 },
      storageUnit: { id: 12 },
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    };
    const onClose = jest.fn();
    const onSave = jest.fn();

    render(<RentingForm editingRenting={editingRenting} onClose={onClose} onSave={onSave} />);

    await waitFor(() => expect(api.fetchUsers).toHaveBeenCalled());

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(api.updateRentings).toHaveBeenCalledWith(9, {
        user: { id: 2 },
        storageUnit: { id: 12 },
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });
      expect(mockNotify.success).toHaveBeenCalledWith("Renting updated successfully.");
      expect(onSave).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test("calls onClose when cancel button clicked", async () => {
    api.fetchUsers.mockResolvedValue({ data: usersMock });
    api.fetchStorageUnits.mockResolvedValue({ data: storageUnitsMock });

    const onClose = jest.fn();
    render(<RentingForm onClose={onClose} />);

    await waitFor(() => expect(api.fetchUsers).toHaveBeenCalled());

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });
});
