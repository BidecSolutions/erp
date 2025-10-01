-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 22, 2025 at 04:23 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ASSET_DEPRECIATION`
--

CREATE TABLE `ASSET_DEPRECIATION` (
  `dep_id` int(11) NOT NULL,
  `asset_id` int(11) DEFAULT NULL,
  `dep_date` date DEFAULT NULL,
  `dep_amount` decimal(10,2) DEFAULT NULL,
  `book_value` decimal(10,2) DEFAULT NULL,
  `fiscal_year` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `journal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ATTENDANCE`
--

CREATE TABLE `ATTENDANCE` (
  `attendance_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `attendance_date` date DEFAULT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `total_hours` decimal(5,2) DEFAULT NULL,
  `regular_hours` decimal(5,2) DEFAULT NULL,
  `overtime_hours` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `check_in_method` varchar(50) DEFAULT NULL,
  `check_out_method` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_manual_entry` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AUDIT_TRAIL`
--

CREATE TABLE `AUDIT_TRAIL` (
  `audit_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `action_type` varchar(50) DEFAULT NULL,
  `old_values` text DEFAULT NULL,
  `new_values` text DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `action_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `BANK_RECONCILIATIONS`
--

CREATE TABLE `BANK_RECONCILIATIONS` (
  `recon_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `recon_date` date DEFAULT NULL,
  `opening_balance` decimal(10,2) DEFAULT NULL,
  `closing_balance` decimal(10,2) DEFAULT NULL,
  `reconciled_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `BANK_RECONCILIATION_DETAILS`
--

CREATE TABLE `BANK_RECONCILIATION_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `recon_id` int(11) DEFAULT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_reconciled` tinyint(1) DEFAULT 0,
  `vendor_payment_id` int(11) DEFAULT NULL,
  `customer_payment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `BRANCHES`
--

CREATE TABLE `BRANCHES` (
  `branch_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_code` varchar(50) NOT NULL,
  `branch_name` varchar(255) NOT NULL,
  `branch_type` varchar(50) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `manager_name` varchar(255) DEFAULT NULL,
  `manager_email` varchar(255) DEFAULT NULL,
  `manager_phone` varchar(20) DEFAULT NULL,
  `opening_balance` decimal(10,2) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(50) DEFAULT NULL,
  `is_head_office` tinyint(1) DEFAULT 0,
  `allow_negative_stock` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `BUDGETS`
--

CREATE TABLE `BUDGETS` (
  `budget_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `fiscal_year_id` int(11) DEFAULT NULL,
  `budgeted_amount` decimal(10,2) DEFAULT NULL,
  `actual_amount` decimal(10,2) DEFAULT NULL,
  `variance` decimal(10,2) DEFAULT NULL,
  `budget_type` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CHART_OF_ACCOUNTS`
--

CREATE TABLE `CHART_OF_ACCOUNTS` (
  `account_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `account_code` varchar(50) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `account_category` varchar(50) DEFAULT NULL,
  `parent_account_id` int(11) DEFAULT NULL,
  `account_level` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_system_account` tinyint(1) DEFAULT 0,
  `allow_manual_entry` tinyint(1) DEFAULT 1,
  `is_bank_account` tinyint(1) DEFAULT 0,
  `is_cash_account` tinyint(1) DEFAULT 0,
  `opening_balance` decimal(10,2) DEFAULT NULL,
  `balance_type` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `COMPANY`
--

CREATE TABLE `COMPANY` (
  `company_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_logo_path` varchar(255) DEFAULT NULL,
  `legal_name` varchar(255) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `registration_no` varchar(50) DEFAULT NULL,
  `license_no` varchar(50) DEFAULT NULL,
  `incorporation_date` date DEFAULT NULL,
  `company_type` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `fiscal_year_start` varchar(10) DEFAULT NULL,
  `time_zone` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMERS`
--

CREATE TABLE `CUSTOMERS` (
  `customer_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `customer_code` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_type` varchar(50) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `credit_limit` decimal(10,2) DEFAULT NULL,
  `credit_days` int(11) DEFAULT NULL,
  `payment_terms` varchar(100) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `gst_no` varchar(50) DEFAULT NULL,
  `pan_no` varchar(50) DEFAULT NULL,
  `opening_balance` decimal(10,2) DEFAULT NULL,
  `balance_type` varchar(20) DEFAULT NULL,
  `customer_status` varchar(50) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `assigned_sales_person` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMER_CATEGORIES`
--

CREATE TABLE `CUSTOMER_CATEGORIES` (
  `category_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `category_code` varchar(50) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMER_CONTACTS`
--

CREATE TABLE `CUSTOMER_CONTACTS` (
  `contact_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMER_INVOICES`
--

CREATE TABLE `CUSTOMER_INVOICES` (
  `invoice_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `sales_order_id` int(11) DEFAULT NULL,
  `invoice_no` varchar(50) NOT NULL,
  `invoice_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `payment_terms` varchar(100) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `outstanding_amount` decimal(10,2) DEFAULT NULL,
  `invoice_status` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMER_INVOICE_DETAILS`
--

CREATE TABLE `CUSTOMER_INVOICE_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMER_PAYMENTS`
--

CREATE TABLE `CUSTOMER_PAYMENTS` (
  `receipt_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `receipt_no` varchar(50) NOT NULL,
  `receipt_date` date DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `deposit_account_id` int(11) DEFAULT NULL,
  `receipt_amount` decimal(10,2) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `receipt_status` varchar(50) DEFAULT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CUSTOMER_PAYMENT_DETAILS`
--

CREATE TABLE `CUSTOMER_PAYMENT_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `receipt_id` int(11) DEFAULT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `allocated_amount` decimal(10,2) DEFAULT NULL,
  `discount_given` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DEPARTMENTS`
--

CREATE TABLE `DEPARTMENTS` (
  `department_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `department_code` varchar(50) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_department_id` int(11) DEFAULT NULL,
  `manager_employee_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DESIGNATIONS`
--

CREATE TABLE `DESIGNATIONS` (
  `designation_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `designation_code` varchar(50) NOT NULL,
  `designation_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `EMPLOYEES`
--

CREATE TABLE `EMPLOYEES` (
  `employee_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `reporting_manager_id` int(11) DEFAULT NULL,
  `employee_code` varchar(50) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `personal_email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `marital_status` varchar(20) DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `nationality` varchar(100) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `confirmation_date` date DEFAULT NULL,
  `resignation_date` date DEFAULT NULL,
  `employment_status` varchar(50) DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `gross_salary` decimal(10,2) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(50) DEFAULT NULL,
  `pan_no` varchar(50) DEFAULT NULL,
  `aadhar_no` varchar(20) DEFAULT NULL,
  `passport_no` varchar(50) DEFAULT NULL,
  `passport_expiry` date DEFAULT NULL,
  `profile_photo_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `EMPLOYEE_DOCUMENTS`
--

CREATE TABLE `EMPLOYEE_DOCUMENTS` (
  `document_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `document_type` varchar(100) DEFAULT NULL,
  `document_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `uploaded_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `EMPLOYEE_LEAVE_ALLOCATION`
--

CREATE TABLE `EMPLOYEE_LEAVE_ALLOCATION` (
  `allocation_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `leave_type_id` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `allocated_days` int(11) DEFAULT NULL,
  `used_days` int(11) DEFAULT NULL,
  `pending_days` int(11) DEFAULT NULL,
  `remaining_days` int(11) DEFAULT NULL,
  `carried_forward` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `EMPLOYEE_SALARY_STRUCTURE`
--

CREATE TABLE `EMPLOYEE_SALARY_STRUCTURE` (
  `structure_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `component_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `calculation_basis` varchar(50) DEFAULT NULL,
  `effective_from` date DEFAULT NULL,
  `effective_to` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FINANCIAL_YEAR`
--

CREATE TABLE `FINANCIAL_YEAR` (
  `fy_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `year_name` varchar(50) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `is_closed` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `FIXED_ASSETS`
--

CREATE TABLE `FIXED_ASSETS` (
  `asset_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `asset_code` varchar(50) NOT NULL,
  `asset_name` varchar(255) NOT NULL,
  `asset_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `purchase_cost` decimal(10,2) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `salvage_value` decimal(10,2) DEFAULT NULL,
  `useful_life_years` int(11) DEFAULT NULL,
  `depreciation_method` varchar(50) DEFAULT NULL,
  `accumulated_depreciation` decimal(10,2) DEFAULT NULL,
  `current_value` decimal(10,2) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `assigned_employee_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `account_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `GOODS_RECEIPTS`
--

CREATE TABLE `GOODS_RECEIPTS` (
  `receipt_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `po_id` int(11) DEFAULT NULL,
  `receipt_no` varchar(50) NOT NULL,
  `supplier_challan_no` varchar(50) DEFAULT NULL,
  `receipt_date` date DEFAULT NULL,
  `challan_date` date DEFAULT NULL,
  `receipt_status` varchar(50) DEFAULT NULL,
  `total_received_amount` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `vehicle_no` varchar(50) DEFAULT NULL,
  `transporter_name` varchar(255) DEFAULT NULL,
  `received_by` int(11) DEFAULT NULL,
  `received_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `GOODS_RECEIPT_DETAILS`
--

CREATE TABLE `GOODS_RECEIPT_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `receipt_id` int(11) DEFAULT NULL,
  `po_detail_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `ordered_quantity` decimal(10,2) DEFAULT NULL,
  `received_quantity` decimal(10,2) DEFAULT NULL,
  `rejected_quantity` decimal(10,2) DEFAULT NULL,
  `accepted_quantity` decimal(10,2) DEFAULT NULL,
  `quality_status` varchar(50) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `HOLIDAYS`
--

CREATE TABLE `HOLIDAYS` (
  `holiday_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `holiday_name` varchar(255) NOT NULL,
  `holiday_date` date DEFAULT NULL,
  `holiday_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_optional` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `INVENTORY_STOCK`
--

CREATE TABLE `INVENTORY_STOCK` (
  `stock_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `current_stock` decimal(10,2) DEFAULT NULL,
  `reserved_stock` decimal(10,2) DEFAULT NULL,
  `available_stock` decimal(10,2) DEFAULT NULL,
  `allocated_stock` decimal(10,2) DEFAULT NULL,
  `damaged_stock` decimal(10,2) DEFAULT NULL,
  `average_cost` decimal(10,2) DEFAULT NULL,
  `last_purchase_price` decimal(10,2) DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `last_updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `JOURNAL_ENTRIES`
--

CREATE TABLE `JOURNAL_ENTRIES` (
  `journal_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `journal_no` varchar(50) NOT NULL,
  `journal_type` varchar(50) DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `narration` text DEFAULT NULL,
  `total_debit` decimal(10,2) DEFAULT NULL,
  `total_credit` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `is_posted` tinyint(1) DEFAULT 0,
  `posted_date` date DEFAULT NULL,
  `posted_by` int(11) DEFAULT NULL,
  `is_auto_generated` tinyint(1) DEFAULT 0,
  `source_module` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `JOURNAL_ENTRY_DETAILS`
--

CREATE TABLE `JOURNAL_ENTRY_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `journal_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `line_description` text DEFAULT NULL,
  `debit_amount` decimal(10,2) DEFAULT NULL,
  `credit_amount` decimal(10,2) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LEAVE_APPLICATIONS`
--

CREATE TABLE `LEAVE_APPLICATIONS` (
  `leave_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `leave_type_id` int(11) DEFAULT NULL,
  `reporting_manager_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_days` int(11) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `application_status` varchar(50) DEFAULT NULL,
  `approval_status` varchar(50) DEFAULT NULL,
  `applied_by` int(11) DEFAULT NULL,
  `applied_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL,
  `approval_comments` text DEFAULT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `is_half_day` tinyint(1) DEFAULT 0,
  `half_day_session` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LEAVE_TYPES`
--

CREATE TABLE `LEAVE_TYPES` (
  `leave_type_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `leave_type_code` varchar(50) NOT NULL,
  `leave_type_name` varchar(255) NOT NULL,
  `annual_allocation` int(11) DEFAULT NULL,
  `max_consecutive_days` decimal(5,2) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT 1,
  `requires_approval` tinyint(1) DEFAULT 1,
  `is_carry_forward` tinyint(1) DEFAULT 0,
  `max_carry_forward_days` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `NUMBER_SERIES`
--

CREATE TABLE `NUMBER_SERIES` (
  `series_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `document_type` varchar(50) DEFAULT NULL,
  `prefix` varchar(20) DEFAULT NULL,
  `current_number` int(11) DEFAULT NULL,
  `start_number` int(11) DEFAULT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `padding_length` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PAYROLL`
--

CREATE TABLE `PAYROLL` (
  `payroll_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `working_days` int(11) DEFAULT NULL,
  `present_days` int(11) DEFAULT NULL,
  `absent_days` int(11) DEFAULT NULL,
  `leave_days` int(11) DEFAULT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `gross_salary` decimal(10,2) DEFAULT NULL,
  `total_earnings` decimal(10,2) DEFAULT NULL,
  `total_deductions` decimal(10,2) DEFAULT NULL,
  `net_salary` decimal(10,2) DEFAULT NULL,
  `tax_deduction` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payroll_status` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_reference` varchar(50) DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `processed_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PAYROLL_COMPONENTS`
--

CREATE TABLE `PAYROLL_COMPONENTS` (
  `component_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `component_code` varchar(50) NOT NULL,
  `component_name` varchar(255) NOT NULL,
  `component_type` varchar(50) DEFAULT NULL,
  `calculation_method` varchar(100) DEFAULT NULL,
  `formula` text DEFAULT NULL,
  `default_amount` decimal(10,2) DEFAULT NULL,
  `min_amount` decimal(10,2) DEFAULT NULL,
  `max_amount` decimal(10,2) DEFAULT NULL,
  `is_taxable` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PAYROLL_DETAILS`
--

CREATE TABLE `PAYROLL_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `payroll_id` int(11) DEFAULT NULL,
  `component_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `calculation_basis` varchar(50) DEFAULT NULL,
  `component_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PERMISSIONS`
--

CREATE TABLE `PERMISSIONS` (
  `permission_id` int(11) NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `permission_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PRODUCTS`
--

CREATE TABLE `PRODUCTS` (
  `product_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `base_uom_id` int(11) DEFAULT NULL,
  `sku` varchar(50) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specifications` text DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `minimum_stock_level` decimal(10,2) DEFAULT NULL,
  `maximum_stock_level` decimal(10,2) DEFAULT NULL,
  `reorder_level` decimal(10,2) DEFAULT NULL,
  `reorder_quantity` decimal(10,2) DEFAULT NULL,
  `is_serialized` tinyint(1) DEFAULT 0,
  `is_batch_tracked` tinyint(1) DEFAULT 0,
  `allow_negative_stock` tinyint(1) DEFAULT 0,
  `warranty_period_days` int(11) DEFAULT NULL,
  `warranty_type` varchar(50) DEFAULT NULL,
  `hsn_code` varchar(50) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `product_status` varchar(50) DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `product_image_path` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PRODUCT_BRANDS`
--

CREATE TABLE `PRODUCT_BRANDS` (
  `brand_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `brand_code` varchar(50) NOT NULL,
  `brand_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PRODUCT_CATEGORIES`
--

CREATE TABLE `PRODUCT_CATEGORIES` (
  `category_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `category_code` varchar(50) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_category_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PRODUCT_VARIANTS`
--

CREATE TABLE `PRODUCT_VARIANTS` (
  `variant_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `variant_code` varchar(50) DEFAULT NULL,
  `attribute_name` varchar(100) DEFAULT NULL,
  `attribute_value` varchar(255) DEFAULT NULL,
  `price_difference` decimal(10,2) DEFAULT NULL,
  `cost_difference` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PROJECTS`
--

CREATE TABLE `PROJECTS` (
  `project_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `project_code` varchar(50) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `project_type` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budgeted_cost` decimal(10,2) DEFAULT NULL,
  `actual_cost` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `project_manager_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `sales_order_id` int(11) DEFAULT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `journal_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PROJECT_TASKS`
--

CREATE TABLE `PROJECT_TASKS` (
  `task_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `task_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `assigned_employee_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PURCHASE_ORDERS`
--

CREATE TABLE `PURCHASE_ORDERS` (
  `po_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `requisition_id` int(11) DEFAULT NULL,
  `po_no` varchar(50) NOT NULL,
  `po_date` date DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `po_priority` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `shipping_charges` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `po_status` varchar(50) DEFAULT NULL,
  `delivery_status` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `terms_conditions` text DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PURCHASE_ORDER_DETAILS`
--

CREATE TABLE `PURCHASE_ORDER_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `po_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `received_quantity` decimal(10,2) DEFAULT NULL,
  `pending_quantity` decimal(10,2) DEFAULT NULL,
  `line_status` varchar(50) DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PURCHASE_REQUISITIONS`
--

CREATE TABLE `PURCHASE_REQUISITIONS` (
  `requisition_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `requisition_no` varchar(50) NOT NULL,
  `requisition_date` date DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `requisition_priority` varchar(50) DEFAULT NULL,
  `requisition_status` varchar(50) DEFAULT NULL,
  `approval_status` varchar(50) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `justification` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `requested_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PURCHASE_REQUISITION_DETAILS`
--

CREATE TABLE `PURCHASE_REQUISITION_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `requisition_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `estimated_price` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `specifications` text DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `QUOTATIONS`
--

CREATE TABLE `QUOTATIONS` (
  `quotation_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `quotation_no` varchar(50) NOT NULL,
  `quotation_date` date DEFAULT NULL,
  `valid_till_date` date DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `quotation_status` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `terms_conditions` text DEFAULT NULL,
  `sales_person_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `QUOTATION_DETAILS`
--

CREATE TABLE `QUOTATION_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `quotation_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ROLES`
--

CREATE TABLE `ROLES` (
  `role_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ROLE_PERMISSIONS`
--

CREATE TABLE `ROLE_PERMISSIONS` (
  `role_permission_id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `permission_id` int(11) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_create` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `can_approve` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SALES_ORDERS`
--

CREATE TABLE `SALES_ORDERS` (
  `order_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_no` varchar(50) NOT NULL,
  `order_date` date DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `order_priority` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `shipping_charges` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `order_status` varchar(50) DEFAULT NULL,
  `delivery_status` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `terms_conditions` text DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `sales_person_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SALES_ORDER_DETAILS`
--

CREATE TABLE `SALES_ORDER_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `discount_percent` decimal(5,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `delivered_quantity` decimal(10,2) DEFAULT NULL,
  `pending_quantity` decimal(10,2) DEFAULT NULL,
  `line_status` varchar(50) DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SERIAL_NUMBERS`
--

CREATE TABLE `SERIAL_NUMBERS` (
  `serial_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `serial_number` varchar(50) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `warranty_start_date` date DEFAULT NULL,
  `warranty_end_date` date DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STOCK_ADJUSTMENTS`
--

CREATE TABLE `STOCK_ADJUSTMENTS` (
  `adjustment_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `adjustment_no` varchar(50) NOT NULL,
  `adjustment_date` date DEFAULT NULL,
  `adjustment_type` varchar(50) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `adjustment_status` varchar(50) DEFAULT NULL,
  `total_value_difference` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STOCK_ADJUSTMENT_DETAILS`
--

CREATE TABLE `STOCK_ADJUSTMENT_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `adjustment_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `serial_number` varchar(50) DEFAULT NULL,
  `current_quantity` decimal(10,2) DEFAULT NULL,
  `adjusted_quantity` decimal(10,2) DEFAULT NULL,
  `difference_quantity` decimal(10,2) DEFAULT NULL,
  `unit_cost` decimal(10,2) DEFAULT NULL,
  `value_difference` decimal(10,2) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STOCK_BATCHES`
--

CREATE TABLE `STOCK_BATCHES` (
  `batch_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `batch_no` varchar(50) NOT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `available_quantity` decimal(10,2) DEFAULT NULL,
  `batch_status` varchar(50) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STOCK_MOVEMENTS`
--

CREATE TABLE `STOCK_MOVEMENTS` (
  `movement_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `serial_number` varchar(50) DEFAULT NULL,
  `movement_type` varchar(50) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `movement_direction` varchar(50) DEFAULT NULL,
  `unit_cost` decimal(10,2) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `movement_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STOCK_TRANSFERS`
--

CREATE TABLE `STOCK_TRANSFERS` (
  `transfer_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `from_warehouse_id` int(11) DEFAULT NULL,
  `to_warehouse_id` int(11) DEFAULT NULL,
  `transfer_no` varchar(50) NOT NULL,
  `transfer_date` date DEFAULT NULL,
  `transfer_status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `requested_by` int(11) DEFAULT NULL,
  `requested_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL,
  `received_by` int(11) DEFAULT NULL,
  `received_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STOCK_TRANSFER_DETAILS`
--

CREATE TABLE `STOCK_TRANSFER_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `transfer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `from_location_id` int(11) DEFAULT NULL,
  `to_location_id` int(11) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `serial_number` varchar(50) DEFAULT NULL,
  `requested_quantity` decimal(10,2) DEFAULT NULL,
  `transferred_quantity` decimal(10,2) DEFAULT NULL,
  `received_quantity` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `STORAGE_LOCATIONS`
--

CREATE TABLE `STORAGE_LOCATIONS` (
  `location_id` int(11) NOT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `location_code` varchar(50) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `location_type` varchar(50) DEFAULT NULL,
  `zone` varchar(50) DEFAULT NULL,
  `aisle` varchar(50) DEFAULT NULL,
  `rack` varchar(50) DEFAULT NULL,
  `shelf` varchar(50) DEFAULT NULL,
  `bin` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SUPPLIERS`
--

CREATE TABLE `SUPPLIERS` (
  `supplier_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `supplier_code` varchar(50) NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `payment_terms` varchar(100) DEFAULT NULL,
  `credit_days` int(11) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `gst_no` varchar(50) DEFAULT NULL,
  `pan_no` varchar(50) DEFAULT NULL,
  `opening_balance` decimal(10,2) DEFAULT NULL,
  `balance_type` varchar(20) DEFAULT NULL,
  `supplier_status` varchar(50) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SUPPLIER_CATEGORIES`
--

CREATE TABLE `SUPPLIER_CATEGORIES` (
  `category_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `category_code` varchar(50) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SUPPLIER_CONTACTS`
--

CREATE TABLE `SUPPLIER_CONTACTS` (
  `contact_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SYSTEM_SETTINGS`
--

CREATE TABLE `SYSTEM_SETTINGS` (
  `setting_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `setting_category` varchar(100) DEFAULT NULL,
  `setting_key` varchar(100) DEFAULT NULL,
  `setting_value` text DEFAULT NULL,
  `data_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_editable` tinyint(1) DEFAULT 1,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TAX_SLABS`
--

CREATE TABLE `TAX_SLABS` (
  `slab_id` int(11) NOT NULL,
  `tax_type_id` int(11) DEFAULT NULL,
  `from_amount` decimal(10,2) DEFAULT NULL,
  `to_amount` decimal(10,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `fixed_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TAX_TYPES`
--

CREATE TABLE `TAX_TYPES` (
  `tax_type_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `tax_code` varchar(50) NOT NULL,
  `tax_name` varchar(255) NOT NULL,
  `tax_type` varchar(50) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  -- `calculation_method` varchar(50) DEFAULT NULL,
  -- `is_compound` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `UNITS_OF_MEASURE`
--

CREATE TABLE `UNITS_OF_MEASURE` (
  `uom_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `uom_code` varchar(50) NOT NULL,
  `uom_name` varchar(255) NOT NULL,
  `uom_type` varchar(50) DEFAULT NULL,
  `conversion_factor` decimal(10,4) DEFAULT NULL,
  `base_uom_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `USERS`
--

CREATE TABLE `USERS` (
  `user_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `user_type` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `login_attempts` int(11) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `password_changed_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `USER_BRANCH_ACCESS`
--

CREATE TABLE `USER_BRANCH_ACCESS` (
  `access_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_create` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `is_default_branch` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `USER_ROLES`
--

CREATE TABLE `USER_ROLES` (
  `user_role_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `assigned_by` int(11) DEFAULT NULL,
  `assigned_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `VENDOR_BILLS`
--

CREATE TABLE `VENDOR_BILLS` (
  `bill_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `bill_no` varchar(50) NOT NULL,
  `supplier_bill_no` varchar(50) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `payment_terms` varchar(100) DEFAULT NULL,
  `bill_amount` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `outstanding_amount` decimal(10,2) DEFAULT NULL,
  `bill_status` varchar(50) DEFAULT NULL,
  `approval_status` varchar(50) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `VENDOR_BILL_DETAILS`
--

CREATE TABLE `VENDOR_BILL_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `bill_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `line_total` decimal(10,2) DEFAULT NULL,
  `tax_rate` decimal(5,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `line_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `VENDOR_PAYMENTS`
--

CREATE TABLE `VENDOR_PAYMENTS` (
  `payment_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `payment_no` varchar(50) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_account_id` int(11) DEFAULT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `currency_code` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `VENDOR_PAYMENT_DETAILS`
--

CREATE TABLE `VENDOR_PAYMENT_DETAILS` (
  `detail_id` int(11) NOT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `bill_id` int(11) DEFAULT NULL,
  `allocated_amount` decimal(10,2) DEFAULT NULL,
  `discount_taken` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `WAREHOUSES`
--

CREATE TABLE `WAREHOUSES` (
  `warehouse_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `warehouse_code` varchar(50) NOT NULL,
  `warehouse_name` varchar(255) NOT NULL,
  `warehouse_type` varchar(50) DEFAULT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `manager_employee_id` int(11) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ASSET_DEPRECIATION`
--
ALTER TABLE `ASSET_DEPRECIATION`
  ADD PRIMARY KEY (`dep_id`),
  ADD KEY `asset_id` (`asset_id`),
  ADD KEY `fk_asset_depreciation_journal` (`journal_id`);

--
-- Indexes for table `ATTENDANCE`
--
ALTER TABLE `ATTENDANCE`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `AUDIT_TRAIL`
--
ALTER TABLE `AUDIT_TRAIL`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `BANK_RECONCILIATIONS`
--
ALTER TABLE `BANK_RECONCILIATIONS`
  ADD PRIMARY KEY (`recon_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `BANK_RECONCILIATION_DETAILS`
--
ALTER TABLE `BANK_RECONCILIATION_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `recon_id` (`recon_id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `fk_bank_recon_vendor` (`vendor_payment_id`),
  ADD KEY `fk_bank_recon_customer` (`customer_payment_id`);

--
-- Indexes for table `BRANCHES`
--
ALTER TABLE `BRANCHES`
  ADD PRIMARY KEY (`branch_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `BUDGETS`
--
ALTER TABLE `BUDGETS`
  ADD PRIMARY KEY (`budget_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `fiscal_year_id` (`fiscal_year_id`);

--
-- Indexes for table `CHART_OF_ACCOUNTS`
--
ALTER TABLE `CHART_OF_ACCOUNTS`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `parent_account_id` (`parent_account_id`);

--
-- Indexes for table `COMPANY`
--
ALTER TABLE `COMPANY`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `CUSTOMERS`
--
ALTER TABLE `CUSTOMERS`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `CUSTOMER_CATEGORIES`
--
ALTER TABLE `CUSTOMER_CATEGORIES`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `CUSTOMER_CONTACTS`
--
ALTER TABLE `CUSTOMER_CONTACTS`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `CUSTOMER_INVOICES`
--
ALTER TABLE `CUSTOMER_INVOICES`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `sales_order_id` (`sales_order_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `CUSTOMER_INVOICE_DETAILS`
--
ALTER TABLE `CUSTOMER_INVOICE_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `CUSTOMER_PAYMENTS`
--
ALTER TABLE `CUSTOMER_PAYMENTS`
  ADD PRIMARY KEY (`receipt_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `deposit_account_id` (`deposit_account_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `CUSTOMER_PAYMENT_DETAILS`
--
ALTER TABLE `CUSTOMER_PAYMENT_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `receipt_id` (`receipt_id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `DEPARTMENTS`
--
ALTER TABLE `DEPARTMENTS`
  ADD PRIMARY KEY (`department_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `parent_department_id` (`parent_department_id`);

--
-- Indexes for table `DESIGNATIONS`
--
ALTER TABLE `DESIGNATIONS`
  ADD PRIMARY KEY (`designation_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `EMPLOYEES`
--
ALTER TABLE `EMPLOYEES`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `designation_id` (`designation_id`),
  ADD KEY `reporting_manager_id` (`reporting_manager_id`);

--
-- Indexes for table `EMPLOYEE_DOCUMENTS`
--
ALTER TABLE `EMPLOYEE_DOCUMENTS`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `EMPLOYEE_LEAVE_ALLOCATION`
--
ALTER TABLE `EMPLOYEE_LEAVE_ALLOCATION`
  ADD PRIMARY KEY (`allocation_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `leave_type_id` (`leave_type_id`);

--
-- Indexes for table `EMPLOYEE_SALARY_STRUCTURE`
--
ALTER TABLE `EMPLOYEE_SALARY_STRUCTURE`
  ADD PRIMARY KEY (`structure_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `component_id` (`component_id`);

--
-- Indexes for table `FINANCIAL_YEAR`
--
ALTER TABLE `FINANCIAL_YEAR`
  ADD PRIMARY KEY (`fy_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `FIXED_ASSETS`
--
ALTER TABLE `FIXED_ASSETS`
  ADD PRIMARY KEY (`asset_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`),
  ADD KEY `fk_fixed_assets_account` (`account_id`);

--
-- Indexes for table `GOODS_RECEIPTS`
--
ALTER TABLE `GOODS_RECEIPTS`
  ADD PRIMARY KEY (`receipt_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `po_id` (`po_id`),
  ADD KEY `received_by` (`received_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `GOODS_RECEIPT_DETAILS`
--
ALTER TABLE `GOODS_RECEIPT_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `receipt_id` (`receipt_id`),
  ADD KEY `po_detail_id` (`po_detail_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `HOLIDAYS`
--
ALTER TABLE `HOLIDAYS`
  ADD PRIMARY KEY (`holiday_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `INVENTORY_STOCK`
--
ALTER TABLE `INVENTORY_STOCK`
  ADD PRIMARY KEY (`stock_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `JOURNAL_ENTRIES`
--
ALTER TABLE `JOURNAL_ENTRIES`
  ADD PRIMARY KEY (`journal_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `posted_by` (`posted_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `JOURNAL_ENTRY_DETAILS`
--
ALTER TABLE `JOURNAL_ENTRY_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `journal_id` (`journal_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `LEAVE_APPLICATIONS`
--
ALTER TABLE `LEAVE_APPLICATIONS`
  ADD PRIMARY KEY (`leave_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `leave_type_id` (`leave_type_id`),
  ADD KEY `reporting_manager_id` (`reporting_manager_id`),
  ADD KEY `applied_by` (`applied_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `LEAVE_TYPES`
--
ALTER TABLE `LEAVE_TYPES`
  ADD PRIMARY KEY (`leave_type_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `NUMBER_SERIES`
--
ALTER TABLE `NUMBER_SERIES`
  ADD PRIMARY KEY (`series_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `PAYROLL`
--
ALTER TABLE `PAYROLL`
  ADD PRIMARY KEY (`payroll_id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `PAYROLL_COMPONENTS`
--
ALTER TABLE `PAYROLL_COMPONENTS`
  ADD PRIMARY KEY (`component_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `PAYROLL_DETAILS`
--
ALTER TABLE `PAYROLL_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `payroll_id` (`payroll_id`),
  ADD KEY `component_id` (`component_id`);

--
-- Indexes for table `PERMISSIONS`
--
ALTER TABLE `PERMISSIONS`
  ADD PRIMARY KEY (`permission_id`);

--
-- Indexes for table `PRODUCTS`
--
ALTER TABLE `PRODUCTS`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `base_uom_id` (`base_uom_id`);

--
-- Indexes for table `PRODUCT_BRANDS`
--
ALTER TABLE `PRODUCT_BRANDS`
  ADD PRIMARY KEY (`brand_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `PRODUCT_CATEGORIES`
--
ALTER TABLE `PRODUCT_CATEGORIES`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `parent_category_id` (`parent_category_id`);

--
-- Indexes for table `PRODUCT_VARIANTS`
--
ALTER TABLE `PRODUCT_VARIANTS`
  ADD PRIMARY KEY (`variant_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `PROJECTS`
--
ALTER TABLE `PROJECTS`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `project_manager_id` (`project_manager_id`),
  ADD KEY `fk_projects_sales_order` (`sales_order_id`),
  ADD KEY `fk_projects_purchase_order` (`purchase_order_id`),
  ADD KEY `fk_projects_journal` (`journal_id`);

--
-- Indexes for table `PROJECT_TASKS`
--
ALTER TABLE `PROJECT_TASKS`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_employee_id` (`assigned_employee_id`);

--
-- Indexes for table `PURCHASE_ORDERS`
--
ALTER TABLE `PURCHASE_ORDERS`
  ADD PRIMARY KEY (`po_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `requisition_id` (`requisition_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `PURCHASE_ORDER_DETAILS`
--
ALTER TABLE `PURCHASE_ORDER_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `po_id` (`po_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `PURCHASE_REQUISITIONS`
--
ALTER TABLE `PURCHASE_REQUISITIONS`
  ADD PRIMARY KEY (`requisition_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `requested_by` (`requested_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `PURCHASE_REQUISITION_DETAILS`
--
ALTER TABLE `PURCHASE_REQUISITION_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `requisition_id` (`requisition_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `QUOTATIONS`
--
ALTER TABLE `QUOTATIONS`
  ADD PRIMARY KEY (`quotation_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `sales_person_id` (`sales_person_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `QUOTATION_DETAILS`
--
ALTER TABLE `QUOTATION_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `quotation_id` (`quotation_id`);

--
-- Indexes for table `ROLES`
--
ALTER TABLE `ROLES`
  ADD PRIMARY KEY (`role_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `ROLE_PERMISSIONS`
--
ALTER TABLE `ROLE_PERMISSIONS`
  ADD PRIMARY KEY (`role_permission_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `SALES_ORDERS`
--
ALTER TABLE `SALES_ORDERS`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `sales_person_id` (`sales_person_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `SALES_ORDER_DETAILS`
--
ALTER TABLE `SALES_ORDER_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `SERIAL_NUMBERS`
--
ALTER TABLE `SERIAL_NUMBERS`
  ADD PRIMARY KEY (`serial_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `batch_id` (`batch_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `STOCK_ADJUSTMENTS`
--
ALTER TABLE `STOCK_ADJUSTMENTS`
  ADD PRIMARY KEY (`adjustment_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `STOCK_ADJUSTMENT_DETAILS`
--
ALTER TABLE `STOCK_ADJUSTMENT_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `adjustment_id` (`adjustment_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `STOCK_BATCHES`
--
ALTER TABLE `STOCK_BATCHES`
  ADD PRIMARY KEY (`batch_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `STOCK_MOVEMENTS`
--
ALTER TABLE `STOCK_MOVEMENTS`
  ADD PRIMARY KEY (`movement_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `STOCK_TRANSFERS`
--
ALTER TABLE `STOCK_TRANSFERS`
  ADD PRIMARY KEY (`transfer_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `from_warehouse_id` (`from_warehouse_id`),
  ADD KEY `to_warehouse_id` (`to_warehouse_id`),
  ADD KEY `requested_by` (`requested_by`),
  ADD KEY `received_by` (`received_by`);

--
-- Indexes for table `STOCK_TRANSFER_DETAILS`
--
ALTER TABLE `STOCK_TRANSFER_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `transfer_id` (`transfer_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `from_location_id` (`from_location_id`),
  ADD KEY `to_location_id` (`to_location_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `STORAGE_LOCATIONS`
--
ALTER TABLE `STORAGE_LOCATIONS`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `warehouse_id` (`warehouse_id`);

--
-- Indexes for table `SUPPLIERS`
--
ALTER TABLE `SUPPLIERS`
  ADD PRIMARY KEY (`supplier_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `SUPPLIER_CATEGORIES`
--
ALTER TABLE `SUPPLIER_CATEGORIES`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `SUPPLIER_CONTACTS`
--
ALTER TABLE `SUPPLIER_CONTACTS`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `SYSTEM_SETTINGS`
--
ALTER TABLE `SYSTEM_SETTINGS`
  ADD PRIMARY KEY (`setting_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `TAX_SLABS`
--
ALTER TABLE `TAX_SLABS`
  ADD PRIMARY KEY (`slab_id`),
  ADD KEY `tax_type_id` (`tax_type_id`);

--
-- Indexes for table `TAX_TYPES`
--
ALTER TABLE `TAX_TYPES`
  ADD PRIMARY KEY (`tax_type_id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `UNITS_OF_MEASURE`
--
ALTER TABLE `UNITS_OF_MEASURE`
  ADD PRIMARY KEY (`uom_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `base_uom_id` (`base_uom_id`);

--
-- Indexes for table `USERS`
--
ALTER TABLE `USERS`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `USER_BRANCH_ACCESS`
--
ALTER TABLE `USER_BRANCH_ACCESS`
  ADD PRIMARY KEY (`access_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `USER_ROLES`
--
ALTER TABLE `USER_ROLES`
  ADD PRIMARY KEY (`user_role_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `VENDOR_BILLS`
--
ALTER TABLE `VENDOR_BILLS`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `purchase_order_id` (`purchase_order_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `VENDOR_BILL_DETAILS`
--
ALTER TABLE `VENDOR_BILL_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `bill_id` (`bill_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `VENDOR_PAYMENTS`
--
ALTER TABLE `VENDOR_PAYMENTS`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `payment_account_id` (`payment_account_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `VENDOR_PAYMENT_DETAILS`
--
ALTER TABLE `VENDOR_PAYMENT_DETAILS`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `bill_id` (`bill_id`);

--
-- Indexes for table `WAREHOUSES`
--
ALTER TABLE `WAREHOUSES`
  ADD PRIMARY KEY (`warehouse_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `manager_employee_id` (`manager_employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ASSET_DEPRECIATION`
--
ALTER TABLE `ASSET_DEPRECIATION`
  MODIFY `dep_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ATTENDANCE`
--
ALTER TABLE `ATTENDANCE`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `AUDIT_TRAIL`
--
ALTER TABLE `AUDIT_TRAIL`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `BANK_RECONCILIATIONS`
--
ALTER TABLE `BANK_RECONCILIATIONS`
  MODIFY `recon_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `BANK_RECONCILIATION_DETAILS`
--
ALTER TABLE `BANK_RECONCILIATION_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `BRANCHES`
--
ALTER TABLE `BRANCHES`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `BUDGETS`
--
ALTER TABLE `BUDGETS`
  MODIFY `budget_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CHART_OF_ACCOUNTS`
--
ALTER TABLE `CHART_OF_ACCOUNTS`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `COMPANY`
--
ALTER TABLE `COMPANY`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMERS`
--
ALTER TABLE `CUSTOMERS`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMER_CATEGORIES`
--
ALTER TABLE `CUSTOMER_CATEGORIES`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMER_CONTACTS`
--
ALTER TABLE `CUSTOMER_CONTACTS`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMER_INVOICES`
--
ALTER TABLE `CUSTOMER_INVOICES`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMER_INVOICE_DETAILS`
--
ALTER TABLE `CUSTOMER_INVOICE_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMER_PAYMENTS`
--
ALTER TABLE `CUSTOMER_PAYMENTS`
  MODIFY `receipt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CUSTOMER_PAYMENT_DETAILS`
--
ALTER TABLE `CUSTOMER_PAYMENT_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `DEPARTMENTS`
--
ALTER TABLE `DEPARTMENTS`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `DESIGNATIONS`
--
ALTER TABLE `DESIGNATIONS`
  MODIFY `designation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `EMPLOYEES`
--
ALTER TABLE `EMPLOYEES`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `EMPLOYEE_DOCUMENTS`
--
ALTER TABLE `EMPLOYEE_DOCUMENTS`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `EMPLOYEE_LEAVE_ALLOCATION`
--
ALTER TABLE `EMPLOYEE_LEAVE_ALLOCATION`
  MODIFY `allocation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `EMPLOYEE_SALARY_STRUCTURE`
--
ALTER TABLE `EMPLOYEE_SALARY_STRUCTURE`
  MODIFY `structure_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `FINANCIAL_YEAR`
--
ALTER TABLE `FINANCIAL_YEAR`
  MODIFY `fy_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `FIXED_ASSETS`
--
ALTER TABLE `FIXED_ASSETS`
  MODIFY `asset_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `GOODS_RECEIPTS`
--
ALTER TABLE `GOODS_RECEIPTS`
  MODIFY `receipt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `GOODS_RECEIPT_DETAILS`
--
ALTER TABLE `GOODS_RECEIPT_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `HOLIDAYS`
--
ALTER TABLE `HOLIDAYS`
  MODIFY `holiday_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `INVENTORY_STOCK`
--
ALTER TABLE `INVENTORY_STOCK`
  MODIFY `stock_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `JOURNAL_ENTRIES`
--
ALTER TABLE `JOURNAL_ENTRIES`
  MODIFY `journal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `JOURNAL_ENTRY_DETAILS`
--
ALTER TABLE `JOURNAL_ENTRY_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `LEAVE_APPLICATIONS`
--
ALTER TABLE `LEAVE_APPLICATIONS`
  MODIFY `leave_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `LEAVE_TYPES`
--
ALTER TABLE `LEAVE_TYPES`
  MODIFY `leave_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `NUMBER_SERIES`
--
ALTER TABLE `NUMBER_SERIES`
  MODIFY `series_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PAYROLL`
--
ALTER TABLE `PAYROLL`
  MODIFY `payroll_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PAYROLL_COMPONENTS`
--
ALTER TABLE `PAYROLL_COMPONENTS`
  MODIFY `component_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PAYROLL_DETAILS`
--
ALTER TABLE `PAYROLL_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PERMISSIONS`
--
ALTER TABLE `PERMISSIONS`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PRODUCTS`
--
ALTER TABLE `PRODUCTS`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PRODUCT_BRANDS`
--
ALTER TABLE `PRODUCT_BRANDS`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PRODUCT_CATEGORIES`
--
ALTER TABLE `PRODUCT_CATEGORIES`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PRODUCT_VARIANTS`
--
ALTER TABLE `PRODUCT_VARIANTS`
  MODIFY `variant_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PROJECTS`
--
ALTER TABLE `PROJECTS`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PROJECT_TASKS`
--
ALTER TABLE `PROJECT_TASKS`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PURCHASE_ORDERS`
--
ALTER TABLE `PURCHASE_ORDERS`
  MODIFY `po_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PURCHASE_ORDER_DETAILS`
--
ALTER TABLE `PURCHASE_ORDER_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PURCHASE_REQUISITIONS`
--
ALTER TABLE `PURCHASE_REQUISITIONS`
  MODIFY `requisition_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PURCHASE_REQUISITION_DETAILS`
--
ALTER TABLE `PURCHASE_REQUISITION_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `QUOTATIONS`
--
ALTER TABLE `QUOTATIONS`
  MODIFY `quotation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `QUOTATION_DETAILS`
--
ALTER TABLE `QUOTATION_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ROLES`
--
ALTER TABLE `ROLES`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ROLE_PERMISSIONS`
--
ALTER TABLE `ROLE_PERMISSIONS`
  MODIFY `role_permission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SALES_ORDERS`
--
ALTER TABLE `SALES_ORDERS`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SALES_ORDER_DETAILS`
--
ALTER TABLE `SALES_ORDER_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SERIAL_NUMBERS`
--
ALTER TABLE `SERIAL_NUMBERS`
  MODIFY `serial_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STOCK_ADJUSTMENTS`
--
ALTER TABLE `STOCK_ADJUSTMENTS`
  MODIFY `adjustment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STOCK_ADJUSTMENT_DETAILS`
--
ALTER TABLE `STOCK_ADJUSTMENT_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STOCK_BATCHES`
--
ALTER TABLE `STOCK_BATCHES`
  MODIFY `batch_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STOCK_MOVEMENTS`
--
ALTER TABLE `STOCK_MOVEMENTS`
  MODIFY `movement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STOCK_TRANSFERS`
--
ALTER TABLE `STOCK_TRANSFERS`
  MODIFY `transfer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STOCK_TRANSFER_DETAILS`
--
ALTER TABLE `STOCK_TRANSFER_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `STORAGE_LOCATIONS`
--
ALTER TABLE `STORAGE_LOCATIONS`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SUPPLIERS`
--
ALTER TABLE `SUPPLIERS`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SUPPLIER_CATEGORIES`
--
ALTER TABLE `SUPPLIER_CATEGORIES`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SUPPLIER_CONTACTS`
--
ALTER TABLE `SUPPLIER_CONTACTS`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SYSTEM_SETTINGS`
--
ALTER TABLE `SYSTEM_SETTINGS`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TAX_SLABS`
--
ALTER TABLE `TAX_SLABS`
  MODIFY `slab_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TAX_TYPES`
--
ALTER TABLE `TAX_TYPES`
  MODIFY `tax_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `UNITS_OF_MEASURE`
--
ALTER TABLE `UNITS_OF_MEASURE`
  MODIFY `uom_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USERS`
--
ALTER TABLE `USERS`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USER_BRANCH_ACCESS`
--
ALTER TABLE `USER_BRANCH_ACCESS`
  MODIFY `access_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USER_ROLES`
--
ALTER TABLE `USER_ROLES`
  MODIFY `user_role_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `VENDOR_BILLS`
--
ALTER TABLE `VENDOR_BILLS`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `VENDOR_BILL_DETAILS`
--
ALTER TABLE `VENDOR_BILL_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `VENDOR_PAYMENTS`
--
ALTER TABLE `VENDOR_PAYMENTS`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `VENDOR_PAYMENT_DETAILS`
--
ALTER TABLE `VENDOR_PAYMENT_DETAILS`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `WAREHOUSES`
--
ALTER TABLE `WAREHOUSES`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ASSET_DEPRECIATION`
--
ALTER TABLE `ASSET_DEPRECIATION`
  ADD CONSTRAINT `asset_depreciation_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `FIXED_ASSETS` (`asset_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_asset_depreciation_journal` FOREIGN KEY (`journal_id`) REFERENCES `JOURNAL_ENTRIES` (`journal_id`);

--
-- Constraints for table `ATTENDANCE`
--
ALTER TABLE `ATTENDANCE`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`);

--
-- Constraints for table `AUDIT_TRAIL`
--
ALTER TABLE `AUDIT_TRAIL`
  ADD CONSTRAINT `audit_trail_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `audit_trail_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `audit_trail_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `audit_trail_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `BANK_RECONCILIATIONS`
--
ALTER TABLE `BANK_RECONCILIATIONS`
  ADD CONSTRAINT `bank_reconciliations_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `bank_reconciliations_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `bank_reconciliations_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`);

--
-- Constraints for table `BANK_RECONCILIATION_DETAILS`
--
ALTER TABLE `BANK_RECONCILIATION_DETAILS`
  ADD CONSTRAINT `bank_reconciliation_details_ibfk_1` FOREIGN KEY (`recon_id`) REFERENCES `BANK_RECONCILIATIONS` (`recon_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bank_reconciliation_details_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `VENDOR_PAYMENTS` (`payment_id`),
  ADD CONSTRAINT `bank_reconciliation_details_ibfk_3` FOREIGN KEY (`transaction_id`) REFERENCES `VENDOR_PAYMENTS` (`payment_id`),
  ADD CONSTRAINT `fk_bank_recon_customer` FOREIGN KEY (`customer_payment_id`) REFERENCES `CUSTOMER_PAYMENTS` (`receipt_id`),
  ADD CONSTRAINT `fk_bank_recon_vendor` FOREIGN KEY (`vendor_payment_id`) REFERENCES `VENDOR_PAYMENTS` (`payment_id`);

--
-- Constraints for table `BRANCHES`
--
ALTER TABLE `BRANCHES`
  ADD CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `BUDGETS`
--
ALTER TABLE `BUDGETS`
  ADD CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `budgets_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`),
  ADD CONSTRAINT `budgets_ibfk_3` FOREIGN KEY (`fiscal_year_id`) REFERENCES `FINANCIAL_YEAR` (`fy_id`);

--
-- Constraints for table `CHART_OF_ACCOUNTS`
--
ALTER TABLE `CHART_OF_ACCOUNTS`
  ADD CONSTRAINT `chart_of_accounts_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `chart_of_accounts_ibfk_2` FOREIGN KEY (`parent_account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`);

--
-- Constraints for table `CUSTOMERS`
--
ALTER TABLE `CUSTOMERS`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `customers_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `customers_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `CUSTOMER_CATEGORIES` (`category_id`);

--
-- Constraints for table `CUSTOMER_CATEGORIES`
--
ALTER TABLE `CUSTOMER_CATEGORIES`
  ADD CONSTRAINT `customer_categories_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `CUSTOMER_CONTACTS`
--
ALTER TABLE `CUSTOMER_CONTACTS`
  ADD CONSTRAINT `customer_contacts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `CUSTOMER_INVOICES`
--
ALTER TABLE `CUSTOMER_INVOICES`
  ADD CONSTRAINT `customer_invoices_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_10` FOREIGN KEY (`sales_order_id`) REFERENCES `SALES_ORDERS` (`order_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_12` FOREIGN KEY (`sales_order_id`) REFERENCES `SALES_ORDERS` (`order_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_13` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS` (`customer_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_4` FOREIGN KEY (`sales_order_id`) REFERENCES `SALES_ORDERS` (`order_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_6` FOREIGN KEY (`sales_order_id`) REFERENCES `SALES_ORDERS` (`order_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_8` FOREIGN KEY (`sales_order_id`) REFERENCES `SALES_ORDERS` (`order_id`),
  ADD CONSTRAINT `customer_invoices_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `CUSTOMER_INVOICE_DETAILS`
--
ALTER TABLE `CUSTOMER_INVOICE_DETAILS`
  ADD CONSTRAINT `customer_invoice_details_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `CUSTOMER_INVOICES` (`invoice_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_invoice_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`);

--
-- Constraints for table `CUSTOMER_PAYMENTS`
--
ALTER TABLE `CUSTOMER_PAYMENTS`
  ADD CONSTRAINT `customer_payments_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `customer_payments_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_12` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_13` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_14` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_15` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_16` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_17` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_18` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `customer_payments_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS` (`customer_id`),
  ADD CONSTRAINT `customer_payments_ibfk_4` FOREIGN KEY (`deposit_account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`),
  ADD CONSTRAINT `customer_payments_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `customer_payments_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `CUSTOMER_PAYMENT_DETAILS`
--
ALTER TABLE `CUSTOMER_PAYMENT_DETAILS`
  ADD CONSTRAINT `customer_payment_details_ibfk_1` FOREIGN KEY (`receipt_id`) REFERENCES `CUSTOMER_PAYMENTS` (`receipt_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_payment_details_ibfk_2` FOREIGN KEY (`invoice_id`) REFERENCES `CUSTOMER_INVOICES` (`invoice_id`);

--
-- Constraints for table `DEPARTMENTS`
--
ALTER TABLE `DEPARTMENTS`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `departments_ibfk_2` FOREIGN KEY (`parent_department_id`) REFERENCES `DEPARTMENTS` (`department_id`);

--
-- Constraints for table `DESIGNATIONS`
--
ALTER TABLE `DESIGNATIONS`
  ADD CONSTRAINT `designations_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `designations_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `DEPARTMENTS` (`department_id`);

--
-- Constraints for table `EMPLOYEES`
--
ALTER TABLE `EMPLOYEES`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `DEPARTMENTS` (`department_id`),
  ADD CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`designation_id`) REFERENCES `DESIGNATIONS` (`designation_id`),
  ADD CONSTRAINT `employees_ibfk_5` FOREIGN KEY (`reporting_manager_id`) REFERENCES `EMPLOYEES` (`employee_id`);

--
-- Constraints for table `EMPLOYEE_DOCUMENTS`
--
ALTER TABLE `EMPLOYEE_DOCUMENTS`
  ADD CONSTRAINT `employee_documents_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `EMPLOYEE_LEAVE_ALLOCATION`
--
ALTER TABLE `EMPLOYEE_LEAVE_ALLOCATION`
  ADD CONSTRAINT `employee_leave_allocation_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_leave_allocation_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `LEAVE_TYPES` (`leave_type_id`);

--
-- Constraints for table `EMPLOYEE_SALARY_STRUCTURE`
--
ALTER TABLE `EMPLOYEE_SALARY_STRUCTURE`
  ADD CONSTRAINT `employee_salary_structure_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_salary_structure_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `PAYROLL_COMPONENTS` (`component_id`);

--
-- Constraints for table `FINANCIAL_YEAR`
--
ALTER TABLE `FINANCIAL_YEAR`
  ADD CONSTRAINT `financial_year_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `FIXED_ASSETS`
--
ALTER TABLE `FIXED_ASSETS`
  ADD CONSTRAINT `fixed_assets_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `fixed_assets_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `fixed_assets_ibfk_3` FOREIGN KEY (`assigned_employee_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `fk_fixed_assets_account` FOREIGN KEY (`account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`);

--
-- Constraints for table `GOODS_RECEIPTS`
--
ALTER TABLE `GOODS_RECEIPTS`
  ADD CONSTRAINT `goods_receipts_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_11` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `SUPPLIERS` (`supplier_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_4` FOREIGN KEY (`po_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_5` FOREIGN KEY (`received_by`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_7` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `goods_receipts_ibfk_9` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `GOODS_RECEIPT_DETAILS`
--
ALTER TABLE `GOODS_RECEIPT_DETAILS`
  ADD CONSTRAINT `goods_receipt_details_ibfk_1` FOREIGN KEY (`receipt_id`) REFERENCES `GOODS_RECEIPTS` (`receipt_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `goods_receipt_details_ibfk_2` FOREIGN KEY (`po_detail_id`) REFERENCES `PURCHASE_ORDER_DETAILS` (`detail_id`),
  ADD CONSTRAINT `goods_receipt_details_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`);

--
-- Constraints for table `HOLIDAYS`
--
ALTER TABLE `HOLIDAYS`
  ADD CONSTRAINT `holidays_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `INVENTORY_STOCK`
--
ALTER TABLE `INVENTORY_STOCK`
  ADD CONSTRAINT `inventory_stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`),
  ADD CONSTRAINT `inventory_stock_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`),
  ADD CONSTRAINT `inventory_stock_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `STORAGE_LOCATIONS` (`location_id`);

--
-- Constraints for table `JOURNAL_ENTRIES`
--
ALTER TABLE `JOURNAL_ENTRIES`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `journal_entries_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_11` FOREIGN KEY (`posted_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_12` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `journal_entries_ibfk_3` FOREIGN KEY (`posted_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_5` FOREIGN KEY (`posted_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_7` FOREIGN KEY (`posted_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `journal_entries_ibfk_9` FOREIGN KEY (`posted_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `JOURNAL_ENTRY_DETAILS`
--
ALTER TABLE `JOURNAL_ENTRY_DETAILS`
  ADD CONSTRAINT `journal_entry_details_ibfk_1` FOREIGN KEY (`journal_id`) REFERENCES `JOURNAL_ENTRIES` (`journal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entry_details_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`);

--
-- Constraints for table `LEAVE_APPLICATIONS`
--
ALTER TABLE `LEAVE_APPLICATIONS`
  ADD CONSTRAINT `leave_applications_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `leave_applications_ibfk_10` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_11` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_12` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_13` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_14` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_15` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_16` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_17` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `LEAVE_TYPES` (`leave_type_id`),
  ADD CONSTRAINT `leave_applications_ibfk_3` FOREIGN KEY (`reporting_manager_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `leave_applications_ibfk_4` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_6` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_7` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_8` FOREIGN KEY (`applied_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `leave_applications_ibfk_9` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `LEAVE_TYPES`
--
ALTER TABLE `LEAVE_TYPES`
  ADD CONSTRAINT `leave_types_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `NUMBER_SERIES`
--
ALTER TABLE `NUMBER_SERIES`
  ADD CONSTRAINT `number_series_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `number_series_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`);

--
-- Constraints for table `PAYROLL`
--
ALTER TABLE `PAYROLL`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `payroll_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`);

--
-- Constraints for table `PAYROLL_COMPONENTS`
--
ALTER TABLE `PAYROLL_COMPONENTS`
  ADD CONSTRAINT `payroll_components_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `PAYROLL_DETAILS`
--
ALTER TABLE `PAYROLL_DETAILS`
  ADD CONSTRAINT `payroll_details_ibfk_1` FOREIGN KEY (`payroll_id`) REFERENCES `PAYROLL` (`payroll_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_details_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `PAYROLL_COMPONENTS` (`component_id`);

--
-- Constraints for table `PRODUCTS`
--
ALTER TABLE `PRODUCTS`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `PRODUCT_CATEGORIES` (`category_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `PRODUCT_BRANDS` (`brand_id`),
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`base_uom_id`) REFERENCES `UNITS_OF_MEASURE` (`uom_id`);

--
-- Constraints for table `PRODUCT_BRANDS`
--
ALTER TABLE `PRODUCT_BRANDS`
  ADD CONSTRAINT `product_brands_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `PRODUCT_CATEGORIES`
--
ALTER TABLE `PRODUCT_CATEGORIES`
  ADD CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`parent_category_id`) REFERENCES `PRODUCT_CATEGORIES` (`category_id`);

--
-- Constraints for table `PRODUCT_VARIANTS`
--
ALTER TABLE `PRODUCT_VARIANTS`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `PROJECTS`
--
ALTER TABLE `PROJECTS`
  ADD CONSTRAINT `fk_projects_journal` FOREIGN KEY (`journal_id`) REFERENCES `JOURNAL_ENTRIES` (`journal_id`),
  ADD CONSTRAINT `fk_projects_purchase_order` FOREIGN KEY (`purchase_order_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `fk_projects_sales_order` FOREIGN KEY (`sales_order_id`) REFERENCES `SALES_ORDERS` (`order_id`),
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`project_manager_id`) REFERENCES `EMPLOYEES` (`employee_id`);

--
-- Constraints for table `PROJECT_TASKS`
--
ALTER TABLE `PROJECT_TASKS`
  ADD CONSTRAINT `project_tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `PROJECTS` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_tasks_ibfk_2` FOREIGN KEY (`assigned_employee_id`) REFERENCES `EMPLOYEES` (`employee_id`);

--
-- Constraints for table `PURCHASE_ORDERS`
--
ALTER TABLE `PURCHASE_ORDERS`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_12` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_13` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_14` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_15` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_16` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_17` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_18` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `SUPPLIERS` (`supplier_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_4` FOREIGN KEY (`requisition_id`) REFERENCES `PURCHASE_REQUISITIONS` (`requisition_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_orders_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `PURCHASE_ORDER_DETAILS`
--
ALTER TABLE `PURCHASE_ORDER_DETAILS`
  ADD CONSTRAINT `purchase_order_details_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`);

--
-- Constraints for table `PURCHASE_REQUISITIONS`
--
ALTER TABLE `PURCHASE_REQUISITIONS`
  ADD CONSTRAINT `purchase_requisitions_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_11` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `DEPARTMENTS` (`department_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_4` FOREIGN KEY (`requested_by`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_7` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `purchase_requisitions_ibfk_9` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `PURCHASE_REQUISITION_DETAILS`
--
ALTER TABLE `PURCHASE_REQUISITION_DETAILS`
  ADD CONSTRAINT `purchase_requisition_details_ibfk_1` FOREIGN KEY (`requisition_id`) REFERENCES `PURCHASE_REQUISITIONS` (`requisition_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_requisition_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`);

--
-- Constraints for table `QUOTATIONS`
--
ALTER TABLE `QUOTATIONS`
  ADD CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `quotations_ibfk_10` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `quotations_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS` (`customer_id`),
  ADD CONSTRAINT `quotations_ibfk_4` FOREIGN KEY (`sales_person_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `quotations_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `quotations_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `quotations_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `quotations_ibfk_8` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `quotations_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `QUOTATION_DETAILS`
--
ALTER TABLE `QUOTATION_DETAILS`
  ADD CONSTRAINT `quotation_details_ibfk_1` FOREIGN KEY (`quotation_id`) REFERENCES `QUOTATIONS` (`quotation_id`) ON DELETE CASCADE;

--
-- Constraints for table `ROLES`
--
ALTER TABLE `ROLES`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `ROLE_PERMISSIONS`
--
ALTER TABLE `ROLE_PERMISSIONS`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `ROLES` (`role_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `PERMISSIONS` (`permission_id`) ON DELETE CASCADE;

--
-- Constraints for table `SALES_ORDERS`
--
ALTER TABLE `SALES_ORDERS`
  ADD CONSTRAINT `sales_orders_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `sales_orders_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_12` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_13` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_14` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `sales_orders_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS` (`customer_id`),
  ADD CONSTRAINT `sales_orders_ibfk_4` FOREIGN KEY (`sales_person_id`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `sales_orders_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `sales_orders_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `SALES_ORDER_DETAILS`
--
ALTER TABLE `SALES_ORDER_DETAILS`
  ADD CONSTRAINT `sales_order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `SALES_ORDERS` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`);

--
-- Constraints for table `SERIAL_NUMBERS`
--
ALTER TABLE `SERIAL_NUMBERS`
  ADD CONSTRAINT `serial_numbers_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`),
  ADD CONSTRAINT `serial_numbers_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`),
  ADD CONSTRAINT `serial_numbers_ibfk_3` FOREIGN KEY (`batch_id`) REFERENCES `STOCK_BATCHES` (`batch_id`),
  ADD CONSTRAINT `serial_numbers_ibfk_4` FOREIGN KEY (`customer_id`) REFERENCES `CUSTOMERS` (`customer_id`);

--
-- Constraints for table `STOCK_ADJUSTMENTS`
--
ALTER TABLE `STOCK_ADJUSTMENTS`
  ADD CONSTRAINT `stock_adjustments_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_10` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_11` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_12` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_13` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_14` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_15` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_16` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_3` FOREIGN KEY (`warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_5` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_7` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_8` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `stock_adjustments_ibfk_9` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `STOCK_ADJUSTMENT_DETAILS`
--
ALTER TABLE `STOCK_ADJUSTMENT_DETAILS`
  ADD CONSTRAINT `stock_adjustment_details_ibfk_1` FOREIGN KEY (`adjustment_id`) REFERENCES `STOCK_ADJUSTMENTS` (`adjustment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_adjustment_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`),
  ADD CONSTRAINT `stock_adjustment_details_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `STORAGE_LOCATIONS` (`location_id`),
  ADD CONSTRAINT `stock_adjustment_details_ibfk_4` FOREIGN KEY (`batch_id`) REFERENCES `STOCK_BATCHES` (`batch_id`);

--
-- Constraints for table `STOCK_BATCHES`
--
ALTER TABLE `STOCK_BATCHES`
  ADD CONSTRAINT `stock_batches_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`),
  ADD CONSTRAINT `stock_batches_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`);

--
-- Constraints for table `STOCK_MOVEMENTS`
--
ALTER TABLE `STOCK_MOVEMENTS`
  ADD CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`),
  ADD CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`),
  ADD CONSTRAINT `stock_movements_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `STORAGE_LOCATIONS` (`location_id`),
  ADD CONSTRAINT `stock_movements_ibfk_4` FOREIGN KEY (`batch_id`) REFERENCES `STOCK_BATCHES` (`batch_id`);

--
-- Constraints for table `STOCK_TRANSFERS`
--
ALTER TABLE `STOCK_TRANSFERS`
  ADD CONSTRAINT `stock_transfers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `stock_transfers_ibfk_2` FOREIGN KEY (`from_warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`),
  ADD CONSTRAINT `stock_transfers_ibfk_3` FOREIGN KEY (`to_warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`),
  ADD CONSTRAINT `stock_transfers_ibfk_4` FOREIGN KEY (`requested_by`) REFERENCES `EMPLOYEES` (`employee_id`),
  ADD CONSTRAINT `stock_transfers_ibfk_5` FOREIGN KEY (`received_by`) REFERENCES `EMPLOYEES` (`employee_id`);

--
-- Constraints for table `STOCK_TRANSFER_DETAILS`
--
ALTER TABLE `STOCK_TRANSFER_DETAILS`
  ADD CONSTRAINT `stock_transfer_details_ibfk_1` FOREIGN KEY (`transfer_id`) REFERENCES `STOCK_TRANSFERS` (`transfer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_transfer_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`),
  ADD CONSTRAINT `stock_transfer_details_ibfk_3` FOREIGN KEY (`from_location_id`) REFERENCES `STORAGE_LOCATIONS` (`location_id`),
  ADD CONSTRAINT `stock_transfer_details_ibfk_4` FOREIGN KEY (`to_location_id`) REFERENCES `STORAGE_LOCATIONS` (`location_id`),
  ADD CONSTRAINT `stock_transfer_details_ibfk_5` FOREIGN KEY (`batch_id`) REFERENCES `STOCK_BATCHES` (`batch_id`);

--
-- Constraints for table `STORAGE_LOCATIONS`
--
ALTER TABLE `STORAGE_LOCATIONS`
  ADD CONSTRAINT `storage_locations_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `WAREHOUSES` (`warehouse_id`) ON DELETE CASCADE;

--
-- Constraints for table `SUPPLIERS`
--
ALTER TABLE `SUPPLIERS`
  ADD CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `suppliers_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `suppliers_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `SUPPLIER_CATEGORIES` (`category_id`);

--
-- Constraints for table `SUPPLIER_CATEGORIES`
--
ALTER TABLE `SUPPLIER_CATEGORIES`
  ADD CONSTRAINT `supplier_categories_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `SUPPLIER_CONTACTS`
--
ALTER TABLE `SUPPLIER_CONTACTS`
  ADD CONSTRAINT `supplier_contacts_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `SUPPLIERS` (`supplier_id`) ON DELETE CASCADE;

--
-- Constraints for table `SYSTEM_SETTINGS`
--
ALTER TABLE `SYSTEM_SETTINGS`
  ADD CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `system_settings_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`);

--
-- Constraints for table `TAX_SLABS`
--
ALTER TABLE `TAX_SLABS`
  ADD CONSTRAINT `tax_slabs_ibfk_1` FOREIGN KEY (`tax_type_id`) REFERENCES `TAX_TYPES` (`tax_type_id`) ON DELETE CASCADE;

--
-- Constraints for table `TAX_TYPES`
--
ALTER TABLE `TAX_TYPES`
  ADD CONSTRAINT `tax_types_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`);

--
-- Constraints for table `UNITS_OF_MEASURE`
--
ALTER TABLE `UNITS_OF_MEASURE`
  ADD CONSTRAINT `units_of_measure_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `units_of_measure_ibfk_2` FOREIGN KEY (`base_uom_id`) REFERENCES `UNITS_OF_MEASURE` (`uom_id`);

--
-- Constraints for table `USERS`
--
ALTER TABLE `USERS`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `EMPLOYEES` (`employee_id`);

--
-- Constraints for table `USER_BRANCH_ACCESS`
--
ALTER TABLE `USER_BRANCH_ACCESS`
  ADD CONSTRAINT `user_branch_access_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_branch_access_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`) ON DELETE CASCADE;

--
-- Constraints for table `USER_ROLES`
--
ALTER TABLE `USER_ROLES`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `ROLES` (`role_id`) ON DELETE CASCADE;

--
-- Constraints for table `VENDOR_BILLS`
--
ALTER TABLE `VENDOR_BILLS`
  ADD CONSTRAINT `vendor_bills_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_10` FOREIGN KEY (`purchase_order_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_12` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_13` FOREIGN KEY (`purchase_order_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_14` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_15` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_16` FOREIGN KEY (`purchase_order_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_17` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_18` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `SUPPLIERS` (`supplier_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_4` FOREIGN KEY (`purchase_order_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_7` FOREIGN KEY (`purchase_order_id`) REFERENCES `PURCHASE_ORDERS` (`po_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_8` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_bills_ibfk_9` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `VENDOR_BILL_DETAILS`
--
ALTER TABLE `VENDOR_BILL_DETAILS`
  ADD CONSTRAINT `vendor_bill_details_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `VENDOR_BILLS` (`bill_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vendor_bill_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `PRODUCTS` (`product_id`);

--
-- Constraints for table `VENDOR_PAYMENTS`
--
ALTER TABLE `VENDOR_PAYMENTS`
  ADD CONSTRAINT `vendor_payments_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_10` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_12` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_13` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_14` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_15` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_16` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_17` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_18` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_3` FOREIGN KEY (`supplier_id`) REFERENCES `SUPPLIERS` (`supplier_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_4` FOREIGN KEY (`payment_account_id`) REFERENCES `CHART_OF_ACCOUNTS` (`account_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_6` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_8` FOREIGN KEY (`approved_by`) REFERENCES `USERS` (`user_id`),
  ADD CONSTRAINT `vendor_payments_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `USERS` (`user_id`);

--
-- Constraints for table `VENDOR_PAYMENT_DETAILS`
--
ALTER TABLE `VENDOR_PAYMENT_DETAILS`
  ADD CONSTRAINT `vendor_payment_details_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `VENDOR_PAYMENTS` (`payment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vendor_payment_details_ibfk_2` FOREIGN KEY (`bill_id`) REFERENCES `VENDOR_BILLS` (`bill_id`);

--
-- Constraints for table `WAREHOUSES`
--
ALTER TABLE `WAREHOUSES`
  ADD CONSTRAINT `warehouses_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `COMPANY` (`company_id`),
  ADD CONSTRAINT `warehouses_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `BRANCHES` (`branch_id`),
  ADD CONSTRAINT `warehouses_ibfk_3` FOREIGN KEY (`manager_employee_id`) REFERENCES `EMPLOYEES` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
