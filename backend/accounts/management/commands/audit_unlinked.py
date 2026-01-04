from django.core.management.base import BaseCommand
from profiles.utils import get_global_audit_results


class Command(BaseCommand):
    help = "Lists students and staff who do not have an assigned login account (unlinked profiles)."

    def handle(self, *args, **options):
        results = get_global_audit_results()
        total_unlinked = 0

        self.stdout.write(
            self.style.MIGRATE_HEADING("--- Unlinked Profiles Inventory ---")
        )

        for schema, data in results.items():
            count = data["unlinked_count"]
            if count > 0:
                self.stdout.write(f"Tenant: {data['name']} ({schema})")
                self.stdout.write(
                    f"  - {count} profiles have no account (user_id is NULL)."
                )
                total_unlinked += count

        if total_unlinked == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    "All profiles are correctly linked to user accounts."
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"\nTotal across platform: {total_unlinked} unlinked profiles."
                )
            )
            self.stdout.write(
                "Note: This is normal for students/parents without email access."
            )
