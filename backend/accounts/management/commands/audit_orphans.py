from django.core.management.base import BaseCommand
from profiles.utils import get_global_audit_results, cleanup_orphans_for_tenant


class Command(BaseCommand):
    help = "Critical Data Integrity Check: Finds and fixes profiles pointing to non-existent users."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fix",
            action="store_true",
            help="Actually delete the orphaned profiles.",
        )

    def handle(self, *args, **options):
        results = get_global_audit_results()
        total_orphans = 0

        self.stdout.write(self.style.ERROR("--- Critical Orphan Audit ---"))

        for schema, data in results.items():
            count = data["orphan_count"]
            if count > 0:
                self.stdout.write(
                    self.style.WARNING(f"Tenant: {data['name']} ({schema})")
                )
                self.stdout.write(
                    f"  - [CRITICAL] {count} profiles found with dead user links!"
                )
                total_orphans += count

                if options["fix"]:
                    deleted = cleanup_orphans_for_tenant(schema)
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"  - Successfully purged {deleted} orphans."
                        )
                    )

        if total_orphans == 0:
            self.stdout.write(
                self.style.SUCCESS("\nPlatform Integrity: 100%. No dead links found.")
            )
        else:
            status = "PURGED" if options["fix"] else "DETECTED"
            self.stdout.write(
                self.style.WARNING(
                    f"\nFinal Report: {total_orphans} dead links {status}."
                )
            )
