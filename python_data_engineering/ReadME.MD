# Member Data Management System
Member Data Management System is a Python Package built with wheel. It processes raw data and validates it.

It creates Objects for each Member which is passed through the `my_processor.core.Member()` class.
Printing each object prints it formatted as `name: Aarav, email: aarav@example.com, phone: 9876543210`.

In case, the data is not validated, it throws a custom error `InvalidMemberDataError`.